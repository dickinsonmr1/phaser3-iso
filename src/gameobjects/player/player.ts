import * as Phaser from 'phaser';
import { Constants } from '../../constants';
import { HealthBar, HUDBarType } from './../healthBar';
import { Projectile, ProjectileType } from './../projectile';
import { Point, Utility } from '../../utility';
import GameScene from '../../scenes/gameScene';

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
    //Police,
    //TrashMan,
    Taxi,
    Ambulance,
    RaceCar,
    PickupTruck,
    Hearse
}

enum CpuPlayerPattern {
    Follow,
    FollowAndAttack,
    Stop,
    StopAndAttack,
    Flee
}

enum PlayerAliveStatus {
    Alive,
    PendingRespawn,
    PermaDead
}

export abstract class Player extends Phaser.Physics.Arcade.Sprite {

    private bodyDrawSize: number = 64;
    private bodyDrawOffset: number = 0;

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

    private numberDeaths: number = 0;

    public deathBurnSpotlight;//: Phaser.GameObjects.Light;

    public headlight;//: Phaser.GameObjects.Light;

    private get healthBarOffsetX(): number {return -30;}
    private get healthBarOffsetY(): number {return -45;}

    public static get healthRating(): number { return 5; }
    public static get specialRating(): number { return 4; }
    public static get speedRating(): number { return 100; }

    public static get maxHealth(): number { return 20; }
    public static get maxShield(): number { return 4; }
    public static get maxTurbo(): number { return 100; }

    private maxSpeed(): number {

        switch(this.vehicleType) {
            //case VehicleType.Police:
                //return 220;
            case VehicleType.Ambulance:
                return 210;
            //case VehicleType.TrashMan:
                //return 210;
            case VehicleType.Taxi:                
                return 210;

            case VehicleType.RaceCar:
                return 250;
            case VehicleType.PickupTruck:
                return 230;
            case VehicleType.Hearse:
                return 220;
            default:
                return 10;
        }
    }
    private maxTurboSpeed(): number { 
        switch(this.vehicleType) {
            //case VehicleType.Police:
                //return this.maxSpeed() * 1.5;
            case VehicleType.Ambulance:
                return this.maxSpeed() * 1.5;
            //case VehicleType.TrashMan:
                //return this.maxSpeed() * 1.5;
            case VehicleType.Taxi:
                return this.maxSpeed() * 1.5;
            case VehicleType.RaceCar:
                return this.maxSpeed() * 1.5;
            default:
                return this.maxSpeed() * 1.5;                
        }
    }

    private get GetTextOffsetY(): number { return -100; }

    turboBar: HealthBar;
    private turboOn: boolean = false;

    healthBar: HealthBar;
    private debugCoordinatesText: Phaser.GameObjects.Text;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetX(): number { return 0; }
    private get GetPlayerNameOffsetY(): number { return -60; }

    private particleEmitterExplosion: Phaser.GameObjects.Particles.ParticleEmitter;
    private particleEmitterSparks: Phaser.GameObjects.Particles.ParticleEmitter;
    private particleEmitterTurbo: Phaser.GameObjects.Particles.ParticleEmitter;
    private particleEmitterDeathBurn: Phaser.GameObjects.Particles.ParticleEmitter;

    public particleEmitterFlamethrower: Phaser.GameObjects.Particles.ParticleEmitter;

    public particleEmitterShockwave: Phaser.GameObjects.Particles.ParticleEmitter;

    private get emitterOffsetY(): number {return 30;}

    private arctangent: number = 0;
    private aimX: number = 0;
    private aimY: number = 0;
    private drawScale: number = 1;

    public playerId: string;

    private cpuPlayerPattern: CpuPlayerPattern = CpuPlayerPattern.Follow;
    
    private cpuFleeDirection: PlayerDrawOrientation = PlayerDrawOrientation.E;

    private getMaxFlamethrowerDistance(): number {return 100;}
    private flamethrowerDistance: number = 0;


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

    public shockwaveTime: number = 0;
    public shockwaveTimeInterval: number = 1000;

    public deadUntilRespawnTime: number = 0;

    public MapPosition: Phaser.Geom.Point;
    public playerPositionOnTileset: Phaser.Geom.Point;

    public vehicleType: VehicleType;
    public animPrefix: string;

    private isCpuPlayer: boolean;

    deathIcon: Phaser.GameObjects.Image;
    deathIconScale: number = 0.5;
    private static get deathIconOffsetX(): number {return 0;}
    private static get deathIconOffsetY(): number {return 0;}

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

        this.setDisplayOrigin(0, 0);

        this.scene.add.existing(this);

        this.playerDrawOrientation = PlayerDrawOrientation.W;

        this.healthBar = new HealthBar(this.scene)
        
        this.healthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            this.health, 
            50, 10, HUDBarType.Health);
        
        this.healthBar.setDepth(Constants.depthHealthBar);
        this.healthBar.show();

        this.turboBar = new HealthBar(this.scene)        
        this.turboBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 1.3,
            this.turbo, 
            50, 5, HUDBarType.Turbo);
        
        this.turboBar.setDepth(Constants.depthHealthBar);
        this.turboBar.show();

        // multiplayer player name text
        var playerNameText = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.playerId,
            {
                font: '16px Verdana'
                //font: '16px Courier',
                //fontFamily: 'KenneyRocketSquare',         
                //color:"rgb(255,255,255)",
            });
        playerNameText.setAlpha(1.0);
        playerNameText.setOrigin(0, 0.5);
        playerNameText.setDepth(Constants.depthTurboParticles);
        //playerNameText.setStroke('rgb(0,0,0)', 4);     
        //playerNameText.setFontSize(24); 
        
        this.multiplayerNameText = playerNameText;
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
        this.multiplayerNameText.setOrigin(0.5, 0.5);
        this.multiplayerNameText.setAlign('center');
        this.multiplayerNameText.setFontSize(16);
        this.multiplayerNameText.setVisible(true);//this.isMultiplayer);

        this.deathIcon = this.scene.add.image(
            this.x,
            this.y,
            'deathIcon');
        this.deathIcon.setOrigin(0.5, 0.5);
        this.deathIcon.setScale(this.deathIconScale);
        //this.deathIcon.setDisplayOrigin(0,0);
        this.deathIcon.alpha = 1;    
        this.deathIcon.setDepth(Constants.depthHealthBar);
        this.deathIcon.setVisible(false);
        
        this.deathBurnSpotlight = this.scene.lights
            .addLight(this.x, this.y)
            .setRadius(100)
            .setColor(0xFFBA6F)
            .setIntensity(1.0)
            .setVisible(false);

        this.headlight = this.scene.lights
            .addLight(this.x, this.y)
            .setRadius(70)
            .setColor(0xFFFFFF)
            .setIntensity(1.0)
            .setVisible(true);
    
        var text  = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "",
            {
                font: 'bold 1px Arial',
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

        
        var body = <Phaser.Physics.Arcade.Body>this.body;

        //body.maxVelocity.x = 500;
        //body.maxVelocity.y = 500;
        //body
          //  .setSize(this.bodyDrawSize, this.bodyDrawSize)
            //.setOffset(-this.bodyDrawOffset, -this.bodyDrawOffset);

        this.setCircle(this.bodyDrawSize, -this.bodyDrawOffset, -this.bodyDrawOffset)

        
        
        this.particleEmitterExplosion = this.scene.add.particles(this.x, this.y, 'explosion', {
            lifespan: 750,
            speed: { min: -50, max: 50 },
            //tint: 0xff0000, 
            scale: {start: 0.5, end: 1.0},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0}
        });

        this.particleEmitterDeathBurn = this.scene.add.particles(this.x, this.y, 'explosion',
        {
            //frame: 'white',

            color: [ 0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404 ],
            lifespan: 750,
            angle: { min: -100, max: -80 },
            scale: {start: 0.75, end: 0.25},
            speed: { min: 100, max: 150 },
            //advance: 2000,
            blendMode: 'ADD',
            /*
            color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
            colorEase: 'quad.out',
            lifespan: 2400,
            angle: { min: -100, max: -80 },
            scale: { start: 0.70, end: 0, ease: 'sine.out' },
            speed: 100,
            advance: 2000,
            blendMode: 'ADD',
            */
            emitting: false            
        });
        //weaponHitParticles.setDepth(4);

        this.particleEmitterSparks = this.scene.add.particles(this.x, this.y, 'sparks', {            
            lifespan: 300,
            speed: { min: -50, max: 50 },
            //tint: 0xff0000, 
            scale: {start: 0.5, end: 1.0},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0},
        });

        this.particleEmitterTurbo = this.scene.add.particles(0, 0, 'smoke', {
            lifespan: 180,
            speed: 100, //{ min: 400, max: 400 },
            //accelerationX: params.velocityX,
            //accelerationY: params.velocityY,
            //rotate: params.angle,
            //gravityY: 300,
            tint: 0x808080, // gray: 808080
            scale: { start: 0.20, end: 0.01 },
            //quantity: 1,
            blendMode: 'ADD',
            //frequency: 25,
            alpha: {start: 1.0, end: 0.5},
            //maxParticles: 25,
            emitting: false
        });

        // https://labs.phaser.io/edit.html?src=src/game%20objects/particle%20emitter/fire%20effects.js        
        this.particleEmitterFlamethrower = this.scene.add.particles(0, 0, 'smoke',
        {
            //x: this.x,
            //y: this.y,
            //frame: 'white',
            //accelerationX: 10,
            //accelerationY: 10,
            color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
            colorEase: 'quad.out',
            lifespan: 400,
            //angle: { min: -280, max: -260 },
            angle: { min: -100, max: -80 },
            scale: { start: 0.40, end: 0, ease: 'sine.out' },
            speed: 100,
            //advance: 2000,
            blendMode: 'ADD',
            emitting: false
        });

        this.particleEmitterShockwave = this.scene.add.particles(this.x, this.y, 'shockwave',
        {
            lifespan: 500,
            //speed: { min: -50, max: 50 },
            tint: 0x187bcd, 
            scaleX: {start: 0.5, end: 5.0, ease: 'sine.out'},
            scaleY: {start: 0.3, end: 3.0, ease: 'sine.out'},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0},
            emitting: true
        });
    }

    abstract createAnims();

    updateCpuBehavior(playerX: number, playerY: number): void {
        if(this.isCpuPlayer) {
        
            var changeBehaviorRand = Utility.getRandomInt(500);
                if(changeBehaviorRand == 0) {
                    this.cpuPlayerPattern = CpuPlayerPattern.Flee;

                    this.cpuFleeDirection = <PlayerDrawOrientation>(Utility.getRandomInt(16));
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
                    this.tryMoveWithGamepad(playerX, playerY); // TODO: try move AWAY from location
                    break;
                case CpuPlayerPattern.FollowAndAttack:
                    this.tryMoveToLocation(playerX, playerY);
                    this.tryAimAtLocation(playerX, playerY);
                    break;
                case CpuPlayerPattern.Follow:
                    this.tryMoveToLocation(playerX, playerY);
                    this.tryAimAtLocation(playerX, playerY);
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
    
        if(this.deadUntilRespawnTime <= 0) 
        {

            this.MapPosition.x += this.body.velocity.x;
            this.MapPosition.y += this.body.velocity.y;

            this.setBounce(1,1);

            var screenPosition = Utility.cartesianToIsometric(this.MapPosition);
            this.playerPositionOnTileset = Utility.getTileCoordinates(this.MapPosition, Constants.isometricTileHeight);

            this.depth = this.y + 64;

            //this.x = screenPosition.x;
            //this.y = screenPosition.y;
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

            this.headlight.setPosition(this.x + this.aimX * 40, this.y + this.aimY * 40);

            if(this.particleEmitterShockwave != null)
                this.particleEmitterShockwave.setPosition(this.x, this.y);
        }
        else {
            this.deadUntilRespawnTime--;
            if(this.deadUntilRespawnTime == 0)
                this.tryRespawn();
        }

        if(this.bulletTime > 0)
            this.bulletTime--;

        if(this.rocketTime > 0)
            this.rocketTime--;

        if(this.shockwaveTime > 0)
            this.shockwaveTime--;

    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setText(`${this.playerId}`)
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0.5, 0.5);
        //text.setAlign('center');
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
        var arctangent = Math.atan2(isometricGamepadAxes.x, isometricGamepadAxes.y);
        this.arctangent = arctangent;//Utility.SnapTo16DirectionAngle(arctangent);

        this.setPlayerDrawOrientation();

        this.calculateAimDirection(this.playerDrawOrientation);
    }

    calculateAimDirectionByTarget(destinationX: number, destinationY: number): void {

        var deltaX = destinationX - this.x;
        var deltaY = destinationY - this.y;

        //var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
        var arctangent =  Math.atan2(deltaX, deltaY);
        this.arctangent = Utility.SnapTo16DirectionAngle(arctangent);

        this.setPlayerDrawOrientation();

        this.calculateAimDirection(this.playerDrawOrientation);
    }
    
    calculateAimDirection(playerDrawOrientation: PlayerDrawOrientation): void{        

        //let angle2 = -this.arctangent + (Math.PI / 2) + (3 * Math.PI / 4);

        let angle2 = -this.arctangent + (Math.PI / 2);// + (3 * Math.PI / 4);

        //let angle2 = this.arctangent + (Math.PI / 2) - (3 * Math.PI / 4);
        this.aimX = Math.cos(angle2);
        this.aimY = Math.sin(angle2);
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

        if(this.deadUntilRespawnTime > 0) return;

        switch(direction) {
            case PlayerDrawOrientation.N:
                this.arctangent = Math.PI;
                break;
            case PlayerDrawOrientation.NE:
                this.arctangent = 3 * Math.PI / 4;
                break;
            case PlayerDrawOrientation.E:
                this.arctangent = 2 * Math.PI / 4;
                break;
            case PlayerDrawOrientation.SE:                    
                this.arctangent = Math.PI / 4;
                break;
            case PlayerDrawOrientation.S:                
                this.arctangent = 0;
                break;
            case PlayerDrawOrientation.SW:    
                this.arctangent = - 1 * Math.PI / 4;              
                break;
            case PlayerDrawOrientation.W:
                this.arctangent = - 2 * Math.PI / 4;
                break;
            case PlayerDrawOrientation.NW:
                this.arctangent = - 3 * Math.PI / 4;  
                break;
            
        }

        this.playerDrawOrientation = direction;

        this.calculateAimDirection(direction);

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();         

        switch(direction) {
            case PlayerDrawOrientation.N:                     
                this.anims.play(`${(this.animPrefix)}-N`, true);
                break;
            case PlayerDrawOrientation.S:                
                this.anims.play(`${(this.animPrefix)}-S`, true);
                break;
            case PlayerDrawOrientation.E:                                      
                this.anims.play(`${(this.animPrefix)}-E`, true);
                break;
            case PlayerDrawOrientation.W:
                this.anims.play(`${(this.animPrefix)}-W`, true);
                break;
            case PlayerDrawOrientation.NE:
                this.anims.play(`${(this.animPrefix)}-NE`, true);
                break;
            case PlayerDrawOrientation.SE:                    
                this.anims.play(`${(this.animPrefix)}-SE`, true);
                break;
            case PlayerDrawOrientation.NW:
                this.anims.play(`${(this.animPrefix)}-NW`, true);   
                break;
            case PlayerDrawOrientation.SW:    
                this.anims.play(`${(this.animPrefix)}-SW`, true);                
                break;
        }
    }

    tryMoveWithGamepad(x: number, y: number) {

        if(this.deadUntilRespawnTime > 0) return;

        this.calculateAimDirectionWithGamePad(x, y);
        
        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  
    }

    tryMoveToLocation(destinationX: number, destinationY: number) {

        if(this.deadUntilRespawnTime > 0) return;

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
    }

    tryMoveAwayFromLocation(destinationX: number, destinationY: number) {

        if(this.deadUntilRespawnTime > 0) return;

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.body.velocity.x = -this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = -this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
    }

    tryAimAtLocation(destinationX: number, destinationY: number) {

       
        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
       
    }

    tryKill() {
        this.deadUntilRespawnTime = Constants.respawnTime;

        this.setVisible(false);
        
        this.setVelocity(0,0);

        this.turbo = 0;
        this.turboBar.updateHealth(this.turbo);

        this.turboBar.setVisible(false);
        this.healthBar.setVisible(false);
        this.multiplayerNameText.setVisible(false);

        this.particleEmitterExplosion.setPosition(this.x, this.y);
        this.particleEmitterExplosion.explode(20);//, this.x, this.y);

        this.particleEmitterDeathBurn.setPosition(this.x, this.y);
        this.particleEmitterDeathBurn.start(0, 1000);

        this.deathBurnSpotlight.setPosition(this.x, this.y);
        this.deathBurnSpotlight.setVisible(true);

        this.headlight.setVisible(false);

        this.deathIcon.setPosition(this.x + Player.deathIconOffsetX, this.y + Player.deathIconOffsetY);
        this.deathIcon.setVisible(true);
        
        this.numberDeaths++;

        let gameScene = <GameScene>this.scene;  

        gameScene.sceneController.hudScene.setInfoText(this.playerId + " destroyed (" + this.numberDeaths + " total)", 2000);

    }

    tryRespawn() {

        this.MapPosition.x = Utility.getRandomInt(200);
        this.MapPosition.y = Utility.getRandomInt(200);

        //this.body.position.x = this.MapPosition.x;
        //this.body.position.y = this.MapPosition.y;

        //this.MapPosition.x += this.body.velocity.x;
        //this.MapPosition.y += this.body.velocity.y;

        var screenPosition = Utility.cartesianToIsometric(this.MapPosition);
        this.playerPositionOnTileset = Utility.getTileCoordinates(this.MapPosition, Constants.isometricTileHeight);

        this.x = screenPosition.x;
        this.y = screenPosition.y;

        this.health = Player.maxHealth;
        this.healthBar.updateHealth(this.health);

        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
        this.tryTurboBoostOff();

        this.deadUntilRespawnTime = 0;

        this.deathIcon.setVisible(false);

        this.setVisible(true);
        
        this.turboBar.setVisible(true);
        this.healthBar.setVisible(true);
        this.multiplayerNameText.setVisible(true);

        this.particleEmitterDeathBurn.emitting = false;
        if(this.deathBurnSpotlight != null)
            this.deathBurnSpotlight.setVisible(false);

        this.headlight.setVisible(true);
    }

    snapToAngle() {

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

        this.tryTurboBoostOff();
    }

   
    tryDamage(projectileType: ProjectileType): void {

        switch(projectileType)
        {
            case ProjectileType.Bullet:
                this.health--;
                this.particleEmitterSparks.setPosition(this.x, this.y);
                this.particleEmitterSparks.explode(5);//, this.x, this.y);
                break;
            case ProjectileType.FireRocket:
            case ProjectileType.HomingRocket:
                this.health -= 5;
                this.particleEmitterExplosion.setPosition(this.x, this.y);
                this.particleEmitterExplosion.explode(10);//, this.x, this.y);
                break;
        }
        
        this.healthBar.updateHealth(this.health);
        //this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);

        if(this.health <= 0){
            this.tryKill();
        }


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

    tryDamageWithFlames(totalDamage: number): void {

        if(this.health > 0) {
            this.health -= totalDamage;
       
            this.healthBar.updateHealth(this.health);
            //this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);
        }
        if(this.health <= 0 && this.deadUntilRespawnTime == 0){
            this.tryKill();
        }
    }

    tryFireSecondaryWeapon() {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.bulletTime) {
            
            this.createProjectile(ProjectileType.Bullet);//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    
    tryFirePrimaryWeapon() {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            var changeBehaviorRand = Utility.getRandomInt(2);
            if(changeBehaviorRand == 0)
                this.createProjectile(ProjectileType.HomingRocket);//this.playerOrientation);
            else
                this.createProjectile(ProjectileType.FireRocket);//this.playerOrientation);

            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    tryFireFlamethrower() {

        if(this.deadUntilRespawnTime > 0) return;

        //let maxDistance = 100;
        let minDistance = 30;

        if(this.flamethrowerDistance < this.getMaxFlamethrowerDistance())
            this.flamethrowerDistance += 10;
        
        for(var i = 0; i < 10; i++) {
            var distance = minDistance + Utility.getRandomInt(this.flamethrowerDistance);
            this.particleEmitterFlamethrower.emitParticleAt(this.x + this.aimX * distance, this.y + this.aimY * distance);               
        }    
        /*
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            var changeBehaviorRand = Utility.getRandomInt(2);
            if(changeBehaviorRand == 0)
                this.createProjectile(this.aimX, this.aimY, ProjectileType.HomingRocket);//this.playerOrientation);
            else
                this.createProjectile(this.aimX, this.aimY, ProjectileType.FireRocket);//this.playerOrientation);

            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
        */
    }  

    tryFireShockwave() {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.shockwaveTime) {
            

            this.particleEmitterShockwave.explode(2);
            
            this.shockwaveTime = gameTime + this.shockwaveTimeInterval;
        }

        //this.particleEmitterShockwave.emitParticleAt(this.x, this.y);   

    }  

    tryStopFireFlamethrower() {
        
        if(this.flamethrowerDistance > 0)
            this.flamethrowerDistance -= 10;
    }

    tryTurboBoostOn(): void {
        
        if(this.deadUntilRespawnTime > 0) return;

        if(this.turbo > 0) {
            this.turboOn = true;
                
            this.turbo--;
            this.turboBar.updateHealth(this.turbo);
            //this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);

            var distance = 15;
            this.particleEmitterTurbo.emitParticleAt(this.x - this.aimX * distance, this.y - this.aimY * distance);               
        }        
    }

    
    tryTurboBoostOff(): void {

        if(this.deadUntilRespawnTime > 0) return;

        if(this.turboOn) {
            this.turboOn = false;            
        }
    }

    tryFireSecondaryWeaponWithGamepad() { //x, y) {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.bulletTime) {
            
            this.createProjectile(ProjectileType.Bullet);//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    tryFirePrimaryWeaponWithGamepad() { //x, y) {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            var changeBehaviorRand = Utility.getRandomInt(2);
            if(changeBehaviorRand == 0)
                this.createProjectile(ProjectileType.HomingRocket);//this.playerOrientation);
            else
                this.createProjectile(ProjectileType.FireRocket);//this.playerOrientation);
                                
            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    refillTurbo() {
        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
        //this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);
    }

    refillHealth() {
        this.health = Player.maxHealth;
        this.healthBar.updateHealth(this.health);
        //this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);
    }

    private createProjectile(projectileType) : Projectile {
        //var body = <Phaser.Physics.Arcade.Body>this.body;
        var velocityX: number;
        var velocityY: number;

        var bulletVelocity = 0;
        var scaleX = 1;
        var scaleY = 1;
        var weaponImageKey = "bullet";

        switch(projectileType) {
            case ProjectileType.HomingRocket:
                bulletVelocity = 550;
                weaponImageKey = "rocket";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
            case ProjectileType.FireRocket:
                bulletVelocity = 550;
                weaponImageKey = "rocket";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
            case ProjectileType.Bullet:
                bulletVelocity = 700;    
                weaponImageKey = "bullet";
                scaleX = 0.25;
                scaleY = 0.25;
                break;
        }            

        velocityX = this.aimX * bulletVelocity;
        velocityY = this.aimY * bulletVelocity;

        var screenPosition = Utility.cartesianToIsometric(this.MapPosition);        
        
        var launchDistanceFromPlayerCenter = 25;

        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI

        var drawAngle = 0;        
        switch(this.playerDrawOrientation) {
            case PlayerDrawOrientation.N:
                drawAngle = Math.PI;
                break;

            case PlayerDrawOrientation.N_NE:                
                drawAngle = 10 * Math.PI / 12;                            
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

            case PlayerDrawOrientation.E_SE:                
                //angle = 3 * Math.PI / 4;  
                drawAngle = 5 * Math.PI / 12;                            
                break;

            case PlayerDrawOrientation.SE:                    
                //angle = 3 * Math.PI / 4;
                drawAngle = 4 * Math.PI / 12;               
                break;

            case PlayerDrawOrientation.S_SE:                    
                //angle = 3 * Math.PI / 4;
                drawAngle = 2 * Math.PI / 12;               
                break;

            case PlayerDrawOrientation.S:                
                drawAngle = 0;
                break;

            case PlayerDrawOrientation.S_SW:    
                //angle = -Math.PI / 4;      
                drawAngle = -2 * Math.PI / 12;                  
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
                drawAngle = -10 * Math.PI / 12;
                break;       
    
        }

        var bullet = new Projectile({
            scene: this.scene,
            projectileType: projectileType,
            isometricX: this.x + this.aimX * launchDistanceFromPlayerCenter, //screenPosition.x, //body.x + this.playerBulletOffsetX(),
            isometricY: this.y + this.aimY * launchDistanceFromPlayerCenter, //screenPosition.y, //body.y + this.getBulletOffsetY(),
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
    }
}