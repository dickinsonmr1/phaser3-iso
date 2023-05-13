import 'phaser'
import { Constants } from '../constants';
import { HealthBar, HUDBarType } from './healthBar';
import { Projectile, ProjectileType } from './projectile';
import { Point, Utility } from '../utility';
import GameScene from '../scenes/gameScene';

export enum PlayerDrawOrientation {
    N,
    S,
    E,
    W,
    NE,
    SE,
    NW,
    SW,
    S_SW,
    W_SW,
    W_NW,
    N_NW,
    N_NE,
    E_NE,
    E_SE,
    S_SE
}

export enum PlayerCartesianOrientation {
    N,
    S,
    E,
    W,
    NE,
    SE,
    NW,
    SW,
    S_SW,
    W_SW,
    W_NW,
    N_NW,
    N_NE,
    E_NE,
    E_SE,
    S_SE
}

export enum VehicleType {
    Police,
    TrashMan,
    Taxi,
    Ambulance,
    RaceCar,
    PickupTruck
}

enum CpuPlayerPattern {
    Follow,
    FollowAndAttack,
    Stop,
    StopAndAttack,
    Flee
}

export class Player extends Phaser.GameObjects.Sprite {
    getPlayerSpeed(): number {
        if(this.turboOn) {
            return this.maxTurboSpeed();
        }
        else 
            return this.maxSpeed();
    }
    private health: number = Player.maxHealth;
    private turbo: number = Player.maxTurbo;
    private shield: number = Player.maxShield / 2;

    private get healthBarOffsetX(): number {return -30;}
    private get healthBarOffsetY(): number {return -40;}

    public static get maxHealth(): number { return 20; }
    public static get maxShield(): number { return 4; }
    public static get maxTurbo(): number { return 100; }

    private maxSpeed(): number {

        switch(this.vehicleType) {
            case VehicleType.Police:
                return 3.5;
            case VehicleType.Ambulance:
                return 2.5;
            case VehicleType.TrashMan:
                return 2;
            case VehicleType.Taxi:                
                return 3;
            case VehicleType.RaceCar:
                return 3.75;
            default:
                return 1;
        }
    }
    private maxTurboSpeed(): number { 
        switch(this.vehicleType) {
            case VehicleType.Police:
                return 3.5 * 1.5;
            case VehicleType.Ambulance:
                return 2.5 * 1.5;
            case VehicleType.TrashMan:
                return 2 * 1.5;
            case VehicleType.Taxi:
                return 3 * 1.5;
            case VehicleType.RaceCar:
                return 3.75 * 1.5;
            default:
                return 1;                
        }
    }

    private get GetTextOffsetY(): number { return -100; }

    turboBar: HealthBar;
    private turboOn: boolean = false;

    healthBar: HealthBar;
    private debugCoordinatesText: Phaser.GameObjects.Text;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetX(): number { return -20; }
    private get GetPlayerNameOffsetY(): number { return -40; }

    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private get emitterOffsetY(): number {return 30;}

    private arctangent: number = 0;
    private aimX: number = 0;
    private aimY: number = 0;
    private drawScale: number = 1;

    public playerId: string;

    private cpuPlayerPattern: CpuPlayerPattern = CpuPlayerPattern.Follow;
    
    private cpuFleeDirection: PlayerDrawOrientation = PlayerDrawOrientation.E;


    playerDrawOrientation: PlayerDrawOrientation;
    getPlayerIsometricOrientation(): PlayerCartesianOrientation {
        switch(this.playerDrawOrientation)
        {
            case PlayerDrawOrientation.N:
                return PlayerCartesianOrientation.NW;
            case PlayerDrawOrientation.NW:
                return PlayerCartesianOrientation.W;
            case PlayerDrawOrientation.W:
                return PlayerCartesianOrientation.SW;
            case PlayerDrawOrientation.SW:
                return PlayerCartesianOrientation.S;
            case PlayerDrawOrientation.S:
                return PlayerCartesianOrientation.SE;
            case PlayerDrawOrientation.SE:
                return PlayerCartesianOrientation.E;
            case PlayerDrawOrientation.E:
                return PlayerCartesianOrientation.NE;
            case PlayerDrawOrientation.NE:
                return PlayerCartesianOrientation.N;

            case PlayerDrawOrientation.N_NW:
                return PlayerCartesianOrientation.W_NW;
            case PlayerDrawOrientation.W_NW:
                return PlayerCartesianOrientation.W_SW;
            case PlayerDrawOrientation.W_SW:
                return PlayerCartesianOrientation.S_SW;
            case PlayerDrawOrientation.S_SW:
                return PlayerCartesianOrientation.S_SE;
            case PlayerDrawOrientation.S_SE:
                return PlayerCartesianOrientation.E_SE;
            case PlayerDrawOrientation.E_SE:
                return PlayerCartesianOrientation.E_NE;
            case PlayerDrawOrientation.E_NE:
                return PlayerCartesianOrientation.N_NE;
            case PlayerDrawOrientation.N_NE:
                return PlayerCartesianOrientation.N_NW;
        }
    }

    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    
    public bulletTime: number = 0;
    public bulletTimeInterval: number = 100;

    public rocketTime: number = 0;
    public rocketTimeInterval: number = 500;
    //private bulletVelocity: number = 7;

    public MapPosition: Phaser.Geom.Point;
    public playerPositionOnTileset: Phaser.Geom.Point;

    public vehicleType: VehicleType;
    private animPrefix: string;

    private isCpuPlayer: boolean;

    constructor(params) {
        super(params.scene, params.mapX, params.mapY, params.key, params.frame);

        this.isCpuPlayer = params.isCpuPlayer;

        var utilities = new Utility();
        //this.ScreenLocation = utilities.MapToScreen(params.mapX, params.mapY);
        //super(params.scene,  this.ScreenLocation.x, this.ScreenLocation.y, params.key, params.frame);

        //let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        this.MapPosition = new Phaser.Geom.Point(params.mapX, params.mapY); 
        this.playerPositionOnTileset = new Phaser.Geom.Point(0,0);

        this.playerId = params.playerId;

        this.vehicleType = params.vehicleType;
        this.drawScale = params.drawScale ?? 1;
        this.scale = this.drawScale;

        this.createAnims();

        this.setDisplayOrigin(0, 100);

        this.scene.add.existing(this);

        this.playerDrawOrientation = PlayerDrawOrientation.W;

        this.healthBar = new HealthBar(this.scene)
        
        this.healthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            this.health, 
            50, 13, HUDBarType.Health);
        
        this.healthBar.setDepth(Constants.depthHealthBar);
        this.healthBar.show();

        this.turboBar = new HealthBar(this.scene)        
        this.turboBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 1.5,
            this.turbo, 
            50, 6, HUDBarType.Turbo);
        
        this.turboBar.setDepth(Constants.depthHealthBar);
        this.turboBar.show();

        // multiplayer player name text
        var playerNameText = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.playerId,
            {
                //font: '16px Courier',
                //fontFamily: 'KenneyRocketSquare',         
                //color:"rgb(255,255,255)",
            });
        playerNameText.setAlpha(0.5);
        playerNameText.setOrigin(0, 0.5);
        playerNameText.setDepth(7);
        //playerNameText.setStroke('rgb(0,0,0)', 4);     
        //playerNameText.setFontSize(24); 
        
        this.multiplayerNameText = playerNameText;
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
        this.multiplayerNameText.setOrigin(0, 0.5);
        this.multiplayerNameText.setFontSize(16);
        this.multiplayerNameText.setVisible(true);//this.isMultiplayer);


    
        var text  = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "",
            {
                font: '16px Arial',
                //fontFamily: 'KenneyRocketSquare',         
                color:"rgb(255,255,255)",
            });
        text.setAlpha(0.5);
        text.setOrigin(0, 0.5);
        text.setDepth(7);
        //playerNameText.setStroke('rgb(0,0,0)', 4);     
        //playerNameText.setFontSize(24); 
        
        let gameScene = <GameScene>this.scene;        
        
            this.debugCoordinatesText = text;
            this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
            this.debugCoordinatesText.setOrigin(0, 0.5);
            this.debugCoordinatesText.setFontSize(12);
            this.debugCoordinatesText.setVisible(true);//this.isMultiplayer);

        if(!gameScene.showDebug) {
            this.hideDebugText();
        }

        
        this.bullets = this.scene.physics.add.group({
            allowGravity: false
        });
    }
    init() {
        this.scene.physics.world.enable(this);

        var weaponHitParticles = this.scene.add.particles('explosion');
        weaponHitParticles.setDepth(4);

        this.particleEmitter = weaponHitParticles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 750,
            speed: { min: -50, max: 50 },
            //tint: 0xff0000, 
            scale: {start: 0.5, end: 1.0},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0},
        });
        //this.particleEmitter.stop();
    }

    createAnims(){
        switch(this.vehicleType){
            case VehicleType.Police:

                this.animPrefix = "raceCarBlue";

                this.animPrefix = "police";
                this.anims.create({
                    key: 'police-N',
                    frames: [{key: 'utilityCars', frame: 'police_N.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-S',
                    frames: [{key: 'utilityCars', frame: 'police_S.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-E',
                    frames: [{key: 'utilityCars', frame: 'police_E.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-W',
                    frames: [{key: 'utilityCars', frame: 'police_W.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-NE',
                    frames: [{key: 'utilityCars', frame: 'police_NE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-NW',
                    frames: [{key: 'utilityCars', frame: 'police_NW.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-SE',
                    frames: [{key: 'utilityCars', frame: 'police_SE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'police-SW',
                    frames: [{key: 'utilityCars', frame: 'police_SW.png'}],
                    frameRate: 10,
                });
                break;
            case VehicleType.TrashMan:
                this.animPrefix = "garbage";
                this.anims.create({
                    key: 'garbage-N',
                    frames: [{key: 'utilityCars', frame: 'garbage_N.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-S',
                    frames: [{key: 'utilityCars', frame: 'garbage_S.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-E',
                    frames: [{key: 'utilityCars', frame: 'garbage_E.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-W',
                    frames: [{key: 'utilityCars', frame: 'garbage_W.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-NE',
                    frames: [{key: 'utilityCars', frame: 'garbage_NE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-NW',
                    frames: [{key: 'utilityCars', frame: 'garbage_NW.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-SE',
                    frames: [{key: 'utilityCars', frame: 'garbage_SE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'garbage-SW',
                    frames: [{key: 'utilityCars', frame: 'garbage_SW.png'}],
                    frameRate: 10,
                });
                break;
            case VehicleType.Ambulance:
                this.animPrefix = "ambulance";
                this.anims.create({
                    key: 'garbage-N',
                    frames: [{key: 'utilityCars', frame: 'ambulance_N.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-S',
                    frames: [{key: 'utilityCars', frame: 'ambulance_S.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-E',
                    frames: [{key: 'utilityCars', frame: 'ambulance_E.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-W',
                    frames: [{key: 'utilityCars', frame: 'ambulance_W.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-NE',
                    frames: [{key: 'utilityCars', frame: 'ambulance_NE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-NW',
                    frames: [{key: 'utilityCars', frame: 'ambulance_NW.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-SE',
                    frames: [{key: 'utilityCars', frame: 'ambulance_SE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'ambulance-SW',
                    frames: [{key: 'utilityCars', frame: 'ambulance_SW.png'}],
                    frameRate: 10,
                });
                break;
            case VehicleType.Taxi:
                this.animPrefix = "taxi";
                this.anims.create({
                    key: 'taxi-N',
                    frames: [{key: 'utilityCars', frame: 'taxi_N.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-S',
                    frames: [{key: 'utilityCars', frame: 'taxi_S.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-E',
                    frames: [{key: 'utilityCars', frame: 'taxi_E.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-W',
                    frames: [{key: 'utilityCars', frame: 'taxi_W.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-NE',
                    frames: [{key: 'utilityCars', frame: 'taxi_NE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-NW',
                    frames: [{key: 'utilityCars', frame: 'taxi_NW.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-SE',
                    frames: [{key: 'utilityCars', frame: 'taxi_SE.png'}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: 'taxi-SW',
                    frames: [{key: 'utilityCars', frame: 'taxi_SW.png'}],
                    frameRate: 10,
                });
                break;
            case VehicleType.RaceCar:
                this.animPrefix = "raceCarBlue";
                
                // https://en.wikipedia.org/wiki/Points_of_the_compass

                // 0272 - SSW
                // 0273 - SW
                // 0274 - WSW
                // 0275 - W

                // 0276 - WNW
                // 0277 - NW
                // 0278 - NNW
                // 0279 - N

                // 0280 - NNE
                // 0281 - NE
                // 0282 - ENE
                // 0283 - E

                // 0284 - ESE
                // 0285 - SE
                // 0286 - SSE
                // 0287 - S
                
                var startIndex = 272;

                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                break;
            case VehicleType.PickupTruck:
                this.animPrefix = "pickupTruckOrange";
                var startIndex = 161;
               
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });            
                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });    
                break;
        }
    }

    updateCpuBehavior(playerX: number, playerY: number): void {
        if(this.isCpuPlayer) {
        
            var changeBehaviorRand = Utility.getRandomInt(500);
                if(changeBehaviorRand == 0) {
                    this.cpuPlayerPattern = CpuPlayerPattern.Flee;

                    this.cpuFleeDirection = <PlayerDrawOrientation>(Utility.getRandomInt(8));
                }
                if(changeBehaviorRand == 1)
                    this.cpuPlayerPattern = CpuPlayerPattern.Follow;
                if(changeBehaviorRand == 2)
                    this.cpuPlayerPattern = CpuPlayerPattern.FollowAndAttack;
                if(changeBehaviorRand == 3)
                    this.cpuPlayerPattern = CpuPlayerPattern.Stop;
                if(changeBehaviorRand == 4)
                    this.cpuPlayerPattern = CpuPlayerPattern.StopAndAttack;
            
            var turboRand = Utility.getRandomInt(25);
                if(turboRand == 0 &&
                    (this.cpuPlayerPattern == CpuPlayerPattern.Flee
                    || this.cpuPlayerPattern == CpuPlayerPattern.Follow
                    || this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack)) {
                        this.tryTurboBoostOn();
                    }
                        
            // distance behavior
            if(this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack
                && Phaser.Math.Distance.Between(playerX, playerY, this.x, this.y) < 100) {
                this.cpuPlayerPattern = CpuPlayerPattern.StopAndAttack;
            }   

            if(this.cpuPlayerPattern == CpuPlayerPattern.Follow
                && Phaser.Math.Distance.Between(playerX, playerY, this.x, this.y) < 100) {
                this.cpuPlayerPattern = CpuPlayerPattern.Stop;
            }

            // movement
            switch(this.cpuPlayerPattern){
                case CpuPlayerPattern.Flee:
                    this.tryMoveWithKeyboard(this.cpuFleeDirection); // TODO: try move AWAY from location
                    break;
                case CpuPlayerPattern.FollowAndAttack:
                    this.tryMoveToLocation(playerX, playerY);
                    break;
                case CpuPlayerPattern.Follow:
                    this.tryMoveToLocation(playerX, playerY);
                    break;
                case CpuPlayerPattern.StopAndAttack:
                    this.tryStopMove();
                    this.tryAimAtLocation(playerX, playerY);
                    break;
                case CpuPlayerPattern.Stop:
                    this.tryStopMove();
                    break;
                default:
                    break;
            }       
            
            // weapon behavior
            if(this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack
                || this.cpuPlayerPattern == CpuPlayerPattern.StopAndAttack) {
                    var weaponRand = Utility.getRandomInt(30);
                    if(weaponRand == 0) this.tryFirePrimaryWeapon();
                    if(weaponRand == 1) this.tryFireSecondaryWeapon();
            }
        }
    }

    update(...args: any[]): void {
    
        this.MapPosition.x += this.body.velocity.x;
        this.MapPosition.y += this.body.velocity.y;

        var screenPosition = Utility.cartesianToIsometric(this.MapPosition);
        this.playerPositionOnTileset = Utility.getTileCoordinates(this.MapPosition, 32);

        this.x = screenPosition.x;
        this.y = screenPosition.y;
        //this.body.position.x = screenPosition.x;
        //this.body.position.y = screenPosition.y;

        this.healthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);

        let gameScene = <GameScene>this.scene;        
        if(gameScene.showDebug) {
            this.alignDebugText(this.x + this.GetPlayerNameOffsetX, this.y + 2 * this.GetPlayerNameOffsetY);    
        }

        this.setOrigin(0.5, 0.5);

        this.turboBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 0.5);

        //this.turboOn = false;

        if(this.bulletTime > 0)
            this.bulletTime--;

        if(this.rocketTime > 0)
            this.rocketTime--;
    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setText(`${this.playerId}`)
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0.5);
    }

    alignDebugText(x: number, y: number) {
        var text = this.debugCoordinatesText;

        text.setText(`Map(${(this.MapPosition.x).toFixed(2)}, ${(this.MapPosition.y).toFixed(2)}) 
                    Iso(${(this.x).toFixed(2)}, ${(this.y).toFixed(2)})
                    \nVelocity(${(this.body.velocity.x).toFixed(2)}, ${(this.body.velocity.y).toFixed(2)})
                    \n@ Tile(${(this.playerPositionOnTileset.x).toFixed(2)}, ${(this.playerPositionOnTileset.y).toFixed(2)})    
                    \n atan ${(this.arctangent / Math.PI).toFixed(2)} PI
                    \n Aim (${(this.aimX / Math.PI).toFixed(2)} PI, ${(this.aimY / Math.PI).toFixed(2)} PI)
                    \n Behavior: ${this.cpuPlayerPattern.toString()}`)

        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0);
    }

    showDebugText() {
        this.debugCoordinatesText.setVisible(true);
    }

    hideDebugText() {
        this.debugCoordinatesText.setVisible(false);
    }


    calculateAimDirectionWithGamePad(x: number, y: number): void {
        var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
        this.arctangent = Math.atan2(isometricGamepadAxes.x, isometricGamepadAxes.y);
        //let angle = this.arctangent;
        //let angle2 = this.arctangent % (Math.PI / 4);

        this.setPlayerDrawOrientation();

        this.calculateAimDirection(this.playerDrawOrientation);
    }

    calculateAimDirectionByTarget(destinationX: number, destinationY: number): void {

        var deltaX = destinationX - this.x;
        var deltaY = destinationY - this.y;

        //var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
        this.arctangent = Math.atan2(deltaX, deltaY);

        this.setPlayerDrawOrientation();

        this.calculateAimDirection(this.playerDrawOrientation);
    }
    
    calculateAimDirection(playerDrawOrientation: PlayerDrawOrientation): void{        

        let angle2 = -this.arctangent + (Math.PI / 2) + (3 * Math.PI / 4);
        //let angle2 = this.arctangent + (Math.PI / 2) - (3 * Math.PI / 4);
        this.aimX = -Math.cos(angle2);
        this.aimY = -Math.sin(angle2);
        return;

        /*
        
        switch(playerDrawOrientation) {
            /////////////////////////////////////////////
            case PlayerDrawOrientation.N:
                this.aimX = -Math.cos(Math.PI / 4);
                this.aimY = -Math.sin(Math.PI / 4);                        
                break;
            /////////////////////////////////////////////

                case PlayerDrawOrientation.N_NE:
                    this.aimX = -Math.cos(Math.PI / 2);
                    this.aimY = -Math.sin(Math.PI / 2);                        
                    break;
            case PlayerDrawOrientation.NE:
                this.aimX = 0;
                this.aimY = -1;                           
                break;
                case PlayerDrawOrientation.E_NE:
                    this.aimX = -Math.cos(3 * Math.PI / 8);
                    this.aimY = -Math.sin(3 * Math.PI / 8);                                      
                    break;

            /////////////////////////////////////////////
            case PlayerDrawOrientation.E:
                this.aimX = -Math.cos(3 * Math.PI / 4);
                this.aimY = -Math.sin(3 * Math.PI / 4);                                      
                break;
            /////////////////////////////////////////////

                case PlayerDrawOrientation.E_SE:
                    this.aimX = Math.cos(3 * Math.PI / 8);
                    this.aimY = Math.sin(3 * Math.PI / 8);                                      
                    break;
            case PlayerDrawOrientation.SE:                    
                this.aimX = 1;
                this.aimY = 0;                
                break;
                case PlayerDrawOrientation.S_SE:                
                    this.aimX = -Math.cos(5 * Math.PI / 8);
                    this.aimY = -Math.sin(5 * Math.PI / 8);                
                    break;

            /////////////////////////////////////////////
            case PlayerDrawOrientation.S:                
                this.aimX = -Math.cos(5 * Math.PI / 4);
                this.aimY = -Math.sin(5 * Math.PI / 4);                
                break;
            /////////////////////////////////////////////

                case PlayerDrawOrientation.S_SW:                
                    this.aimX = -Math.cos(5 * Math.PI / 4);
                    this.aimY = Math.sin(5 * Math.PI / 4);                
                    break;
            case PlayerDrawOrientation.SW:    
                this.aimX = 0;
                this.aimY = 1;
                break;
                case PlayerDrawOrientation.W_SW:
                    this.aimX = -Math.cos(7 * Math.PI / 8);
                    this.aimY = -Math.sin(7 * Math.PI / 8);                           
                    break;

            /////////////////////////////////////////////
            case PlayerDrawOrientation.W:
                this.aimX = -Math.cos(7 * Math.PI / 4);
                this.aimY = -Math.sin(7 * Math.PI / 4);                           
                break;
            /////////////////////////////////////////////

                case PlayerDrawOrientation.W_NW:
                    this.aimX = -Math.cos(Math.PI / 4);
                    this.aimY = -Math.sin(Math.PI / 4);                        
                    break;
                case PlayerDrawOrientation.NW:
                    this.aimX = -1;
                    this.aimY = 0;                
                    break;
                case PlayerDrawOrientation.N_NW: // correct
                    this.aimX = -Math.cos(Math.PI / 8);
                    this.aimY = -Math.sin(Math.PI / 8);                        
                    break;
        }

        */
    }

    tryMoveWithKeyboard(direction: PlayerDrawOrientation) {
        this.playerDrawOrientation = direction;

        this.calculateAimDirection(direction);

        switch(direction) {
            case PlayerDrawOrientation.N:
                this.body.velocity.x = -Math.cos(Math.PI / 4) * this.getPlayerSpeed();
                this.body.velocity.y = -Math.sin(Math.PI / 4) * this.getPlayerSpeed();                            
                this.anims.play(`${(this.animPrefix)}-N`, true);
                break;
            case PlayerDrawOrientation.S:                
                this.body.velocity.x = -Math.cos(5 * Math.PI / 4) * this.getPlayerSpeed();
                this.body.velocity.y = -Math.sin(5 * Math.PI / 4) * this.getPlayerSpeed(); 
                this.anims.play(`${(this.animPrefix)}-S`, true);
                break;
            case PlayerDrawOrientation.E:
                this.body.velocity.x = -Math.cos(3 * Math.PI / 4) * this.getPlayerSpeed();
                this.body.velocity.y = -Math.sin(3 * Math.PI / 4) * this.getPlayerSpeed();                                       
                this.anims.play(`${(this.animPrefix)}-E`, true);
                break;
            case PlayerDrawOrientation.W:
                this.body.velocity.x = -Math.cos(7 * Math.PI / 4) * this.getPlayerSpeed();
                this.body.velocity.y = -Math.sin(7 * Math.PI / 4) * this.getPlayerSpeed();                            
                this.anims.play(`${(this.animPrefix)}-W`, true);
                break;
            case PlayerDrawOrientation.NE:
                this.body.velocity.x = 0;
                this.body.velocity.y = -1 * this.getPlayerSpeed();                              
                this.anims.play(`${(this.animPrefix)}-NE`, true);
                break;
            case PlayerDrawOrientation.SE:                    
                this.body.velocity.x = 1 * this.getPlayerSpeed();
                this.body.velocity.y = 0;                
                this.anims.play(`${(this.animPrefix)}-SE`, true);
                break;
            case PlayerDrawOrientation.NW:
                this.body.velocity.x = -1 * this.getPlayerSpeed();
                this.body.velocity.y = 0;                
                this.anims.play(`${(this.animPrefix)}-NW`, true);   
                break;
            case PlayerDrawOrientation.SW:    
                this.body.velocity.x = 0;
                this.body.velocity.y = 1 * this.getPlayerSpeed();  
                this.anims.play(`${(this.animPrefix)}-SW`, true);                
                break;
        }
    }

    tryMoveWithGamepad(x: number, y: number) {
        this.calculateAimDirectionWithGamePad(x, y);
        
        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  
    }

    tryMoveToLocation(destinationX: number, destinationY: number) {

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
    }

    tryAimAtLocation(destinationX: number, destinationY: number) {

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
       
    }

    setPlayerDrawOrientation() {
        //var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
        //this.arctangent = Math.atan2(isometricGamepadAxes.x, isometricGamepadAxes.y);
        let angle = this.arctangent;
        //let angle2 = this.arctangent % (Math.PI / 4);

        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI
        if(angle >= 15 * Math.PI / 16 || angle < - 15 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.N;
        }

        else if(angle >= 13 * Math.PI / 16 && angle < 15 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.N_NE;
        }
        else if(angle >= 11 * Math.PI / 16 && angle < 13 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.NE;
        }
        else if(angle >= 9 * Math.PI / 16 && angle < 11 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.E_NE;
        }

        else if(angle >= 7 * Math.PI / 16 && angle < 9 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.E;
        }

        else if(angle >= 5 * Math.PI / 16 && angle < 7 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.E_SE;
        }
        else if(angle >= 3 * Math.PI / 16 && angle < 5 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.SE;
        }
        else if(angle >= Math.PI / 16 && angle < 3 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.S_SE;
        }

        else if(angle >= -Math.PI / 16 && angle < Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.S;
        }

        else if(angle >= -3 * Math.PI / 16 && angle < -Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.S_SW;
        }
        else if(angle >= -5 * Math.PI / 16 && angle < -3 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.SW;
        }
        else if(angle >= -7 * Math.PI / 16 && angle < -5 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.W_SW;
        }

        else if(angle >= -9 * Math.PI / 16 && angle < -7 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.W;
        }

        else if(angle >= -11 * Math.PI / 16 && angle < -9 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.W_NW;
        }
        else if(angle >= -13 * Math.PI / 16 && angle < -11 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.NW;
        } 
        else if(angle >= -15 * Math.PI / 16 && angle < -13 * Math.PI / 16) {
            this.playerDrawOrientation = PlayerDrawOrientation.N_NW;
        } 
    }

    playAnimFromPlayerDrawOrientation(drawOrientation: PlayerDrawOrientation) {
        switch(drawOrientation) {
            case PlayerDrawOrientation.N:                    
                this.anims.play(`${(this.animPrefix)}-N`, true);
                break;

            case PlayerDrawOrientation.N_NE:                    
                this.anims.play(`${(this.animPrefix)}-NNE`, true);
                break;
            case PlayerDrawOrientation.NE:                          
                this.anims.play(`${(this.animPrefix)}-NE`, true);
                break;
            case PlayerDrawOrientation.E_NE:                                    
                this.anims.play(`${(this.animPrefix)}-ENE`, true);
                break;

            case PlayerDrawOrientation.E:                                    
                this.anims.play(`${(this.animPrefix)}-E`, true);
                break;

            case PlayerDrawOrientation.E_SE:                    
                this.anims.play(`${(this.animPrefix)}-ESE`, true);
                break;
            case PlayerDrawOrientation.SE:                    
                this.anims.play(`${(this.animPrefix)}-SE`, true);
                break;
            case PlayerDrawOrientation.S_SE:                    
                this.anims.play(`${(this.animPrefix)}-SSE`, true);
                break;

            case PlayerDrawOrientation.S:                
                this.anims.play(`${(this.animPrefix)}-S`, true);
                break;      

            case PlayerDrawOrientation.S_SW:    
                this.anims.play(`${(this.animPrefix)}-SSW`, true);                
                break;
            case PlayerDrawOrientation.SW:    
                this.anims.play(`${(this.animPrefix)}-SW`, true);                
                break;
            case PlayerDrawOrientation.W_SW:    
                this.anims.play(`${(this.animPrefix)}-WSW`, true);                
                break;

            case PlayerDrawOrientation.W:                       
                this.anims.play(`${(this.animPrefix)}-W`, true);
                break;

            case PlayerDrawOrientation.W_NW:
                this.anims.play(`${(this.animPrefix)}-WNW`, true);   
                break;
            case PlayerDrawOrientation.NW:
                this.anims.play(`${(this.animPrefix)}-NW`, true);   
                break;
            case PlayerDrawOrientation.N_NW:
                this.anims.play(`${(this.animPrefix)}-NNW`, true);   
                break;
        }    
    }

    tryStopMove(): void {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    tryDamage(): void {
        this.health--;
        this.healthBar.updateHealth(this.health);
        this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);

        this.particleEmitter.explode(10, this.x, this.y);
        /*
        if(this.hurtTime == 0) {
            if(this.shieldHealth > 0) {
                
                this.shieldHealth--;
                this.scene.events.emit("playerShieldUpdated", this.playerId, this.shieldHealth);
                //this.healthBar.updateHealth(this.health);
                
                this.hurtTime = 60;

                if(this.shieldHealth <= 0) {
                    this.scene.sound.play("shieldDrainSound");
                    this.shieldDrainTime = 20;
                }
            }
            else if(this.health > 0) {
                this.health--;
                this.scene.events.emit("playerHealthUpdated", this.playerId, this.health);

                this.scene.sound.play("hurtSound");
                this.hurtTime = 60;
                this.multiplayerHealthBar.updateHealth(this.health);
            }
        }*/
    }

    tryFireSecondaryWeapon() {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.bulletTime) {
            
            this.createProjectile(this.aimX, this.aimY, ProjectileType.Bullet);//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    
    tryFirePrimaryWeapon() {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            var changeBehaviorRand = Utility.getRandomInt(2);
            if(changeBehaviorRand == 0)
                this.createProjectile(this.aimX, this.aimY, ProjectileType.HomingRocket);//this.playerOrientation);
            else
                this.createProjectile(this.aimX, this.aimY, ProjectileType.FireRocket);//this.playerOrientation);

            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    tryTurboBoostOn(): void {
        
        if(this.turbo > 0) {
            this.turboOn = true;
                
            this.turbo--;
            this.turboBar.updateHealth(this.turbo);
            this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);
        }        
    }

    
    tryTurboBoostOff(): void {
        if(this.turboOn)
            this.turboOn = false;
    }

    tryFireSecondaryWeaponWithGamepad() { //x, y) {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.bulletTime) {
            
            this.createProjectile(this.aimX, this.aimY, ProjectileType.Bullet);//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    tryFirePrimaryWeaponWithGamepad() { //x, y) {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            var changeBehaviorRand = Utility.getRandomInt(2);
            if(changeBehaviorRand == 0)
                this.createProjectile(this.aimX, this.aimY, ProjectileType.HomingRocket);//this.playerOrientation);
            else
                this.createProjectile(this.aimX, this.aimY, ProjectileType.FireRocket);//this.playerOrientation);
                                
            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    refillTurbo() {
        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
        this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);
    }

    refillHealth() {
        this.health = Player.maxHealth;
        this.healthBar.updateHealth(this.health);
        this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);
    }

    private createProjectile(x, y, projectileType) : Projectile {
        //var body = <Phaser.Physics.Arcade.Body>this.body;
        var velocityX: number;
        var velocityY: number;

        var bulletVelocity = 0;
        var scaleX = 1;
        var scaleY = 1;
        var weaponImageKey = "bullet";

        switch(projectileType) {
            case ProjectileType.HomingRocket:
                bulletVelocity = 7;
                weaponImageKey = "rocket";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
            case ProjectileType.FireRocket:
                bulletVelocity = 7;
                weaponImageKey = "rocket";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
            case ProjectileType.Bullet:
                bulletVelocity = 10;    
                weaponImageKey = "bullet";
                scaleX = 0.25;
                scaleY = 0.25;
                break;
        }            

        /*
        velocityX = this.aimX * bulletVelocity;
        velocityY = this.aimY * bulletVelocity;
        return;
        */

        if(x == null && y == null) {
            var cartesianOrientation = this.getPlayerIsometricOrientation();

            switch(cartesianOrientation){
                case PlayerCartesianOrientation.N:
                    velocityX = 0;
                    velocityY = -bulletVelocity;
                    break;
                //case PlayerCartesianOrientation.N_NE:
                    //velocityX = bulletVelocity / 2;
                    //velocityY = -bulletVelocity / 2;
                    //break;
                case PlayerCartesianOrientation.NE:
                    velocityX = bulletVelocity;
                    velocityY = -bulletVelocity;
                    break;
                //case PlayerCartesianOrientation.E_NE:
                    //velocityX = bulletVelocity / 2;
                    //velocityY = -bulletVelocity / 2;
                    //break;
                case PlayerCartesianOrientation.E:
                    velocityX = bulletVelocity;
                    velocityY = 0;
                    break;                 
                //case PlayerCartesianOrientation.E_SE:
                    //velocityX = bulletVelocity / 2;
                    //velocityY = bulletVelocity / 2;
                    //break;   
                case PlayerCartesianOrientation.SE:
                    velocityX = bulletVelocity;
                    velocityY = bulletVelocity;
                    break;
                case PlayerCartesianOrientation.S:
                    velocityX = 0;
                    velocityY = bulletVelocity;
                    break;
                case PlayerCartesianOrientation.SW:
                    velocityX = -bulletVelocity;
                    velocityY = bulletVelocity;
                    break;
                case PlayerCartesianOrientation.W:
                    velocityX = -bulletVelocity;
                    velocityY = 0;
                    break;
                case PlayerCartesianOrientation.NW:
                    velocityX = -bulletVelocity;
                    velocityY = -bulletVelocity;
                    break;

            }
        }
        else {
            // gamepad

            //var temp = this.arctangent + 7 * Math.PI / 4;

            //velocityX = Math.cos(temp) * bulletVelocity;
            //velocityY = Math.sin(-temp) * bulletVelocity;
            velocityX = this.aimX * bulletVelocity;
            velocityY = this.aimY * bulletVelocity;
        }

        var screenPosition = Utility.cartesianToIsometric(this.MapPosition);        

        //var angle = Math.atan2(this.aimY, this.aimX) + 5 * Math.PI / 4;

        var drawAngle = 0;
        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI

        /*
        if(this.arctangent < 0)
            angle = Math.abs(this.arctangent) - Math.abs(this.arctangent % (Math.PI / 4));
        else
            angle = -(Math.abs(this.arctangent) - Math.abs(this.arctangent % (Math.PI / 4)));
        */
        
        var drawAngle = 0;
        switch(this.playerDrawOrientation) {
            case PlayerDrawOrientation.N:
                drawAngle = Math.PI;
                break;

            case PlayerDrawOrientation.N_NE:                
                drawAngle = 9 * Math.PI / 12;                            
                break;
            case PlayerDrawOrientation.NE:                
                //angle = 3 * Math.PI / 4;  
                drawAngle = 8 * Math.PI / 12;                            
                break;
            case PlayerDrawOrientation.E_NE:                
                drawAngle = 7 * Math.PI / 12;                            
                break;

            case PlayerDrawOrientation.E:
                drawAngle = 6 * Math.PI / 12;
                break;

            case PlayerDrawOrientation.NE:                
                //angle = 3 * Math.PI / 4;  
                drawAngle = 5 * Math.PI / 12;                            
                break;

            case PlayerDrawOrientation.SE:                    
                //angle = 3 * Math.PI / 4;
                drawAngle = 4 * Math.PI / 12;               
                break;

            case PlayerDrawOrientation.S_SE:                    
                //angle = 3 * Math.PI / 4;
                drawAngle = 3 * Math.PI / 12;               
                break;

            case PlayerDrawOrientation.S:                
                drawAngle = 0;
                break;

            case PlayerDrawOrientation.S_SW:    
                //angle = -Math.PI / 4;      
                drawAngle = -Math.PI / 3;                  
                break;

            case PlayerDrawOrientation.SW:    
                //angle = -Math.PI / 4;      
                drawAngle = -4 * Math.PI / 12;                  
                break;

            case PlayerDrawOrientation.W_SW:    
                //angle = -Math.PI / 4;      
                drawAngle = -5 * Math.PI / 12;                  
                break;

            case PlayerDrawOrientation.W:
                drawAngle = -6 * Math.PI / 12;
                break;        
            
            case PlayerDrawOrientation.W_NW:
                drawAngle = -7 * Math.PI / 12;
                break;       

            case PlayerDrawOrientation.NW:
                //angle = -3 * Math.PI / 4;
                drawAngle = -8 * Math.PI / 12;               
                break;

            case PlayerDrawOrientation.N_NW:
                drawAngle = -9 * Math.PI / 12;
                break;       
    
        }

        var bullet = new Projectile({
            scene: this.scene,
            projectileType: projectileType,
            isometricX: screenPosition.x, //body.x + this.playerBulletOffsetX(),
            isometricY: screenPosition.y, //body.y + this.getBulletOffsetY(),
            mapPositionX: this.MapPosition.x,
            mapPositionY: this.MapPosition.y,
            key: weaponImageKey,//this.currentWeaponBulletName,
            //flipX: this.flipX,
            damage: 1,//this.currentWeaponDamage,
            velocityX: velocityX,
            velocityY: velocityY,
            scaleX: scaleX,
            scaleY: scaleY,
            angle: -drawAngle
        });
        bullet.init();

        this.bullets.add(bullet);

        return bullet;

        /*
        if (this.flipX) {
            var bullet = this.bullets
                .create(body.x, body.y + this.getBulletOffsetY(), this.currentWeaponBulletName)
                .setFlipX(true)
                .body.setVelocityX(-this.playerBulletVelocityX)
                .setVelocityY(0);

            //bullet.damage = 4;
        }
        else {
            var bullet = this.bullets
                .create(body.x + Player.playerBulletOffsetX, body.y + this.getBulletOffsetY(), this.currentWeaponBulletName)
                .body.setVelocityX(this.playerBulletVelocityX)
                .setVelocityY(0);

            //bullet.damage = 4;
        }
        */
    }
}