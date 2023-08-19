import * as Phaser from 'phaser';
import { Constants } from '../../constants';
import { HealthBar, HUDBarType } from './../healthBar';
import { Projectile, ProjectileType } from './../projectile';
import { Point, Utility } from '../../utility';
import GameScene from '../../scenes/gameScene';
import { CpuPlayerPattern } from './cpuPlayerPattern';

export enum PlayerDrawOrientation {    
    W,
    W_SW,
    SW,
    S_SW,
    S,
    S_SE,
    SE,
    E_SE,
    E,
    E_NE,
    NE,
    N_NE,
    N,
    N_NW,
    NW,
    W_NW    
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
    
    //TrashMan,
    Taxi,
    Ambulance,
    RaceCar,
    PickupTruck,
    Hearse,
    Killdozer,
    MonsterTruck,
    Police
}

enum PlayerAliveStatus {
    Alive,
    PendingRespawn,
    PermaDead
}

export enum PlayerTeam {
    Red,
    Blue,
    Green,
    Yellow
}

export abstract class Player extends Phaser.Physics.Arcade.Sprite {

    private bodyDrawSize() {
        switch(this.vehicleType) {
            case VehicleType.Killdozer:
            case VehicleType.MonsterTruck:
                return 72;  
            case VehicleType.Police:
            case VehicleType.RaceCar:
                return 64;               
            default:
                return 48;
        }
    }

    private bodyDrawOffset(): Phaser.Math.Vector2 {
        switch(this.vehicleType) {
            case VehicleType.Killdozer:
                return new Phaser.Math.Vector2(64, 80); 
            case VehicleType.MonsterTruck:
                return new Phaser.Math.Vector2(64, 64);           
            case VehicleType.Police:
            case VehicleType.RaceCar:
                return new Phaser.Math.Vector2(72, 72);               
            default:
                return new Phaser.Math.Vector2(10, 10);
        }
    }

    getPlayerSpeed(): number {
        if(this.turboOn) {
            return this.maxTurboSpeed();
        }
        else 
            return this.maxSpeed();
    }
    private health: number = this.maxHealth();
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

    public maxHealth(): number {
        switch(this.vehicleType) {
            case VehicleType.Ambulance:
                return 40;
            case VehicleType.Taxi:                
                return 30;
            case VehicleType.RaceCar:
                return 20;
            case VehicleType.PickupTruck:
                return 40;
            case VehicleType.Hearse:
                return 50;
            case VehicleType.Killdozer:
                return 80;        
            case VehicleType.MonsterTruck:
                return 80;            
            default:
                return 20;
        }
    }
    public static get maxShield(): number { return 4; }
    public static get maxTurbo(): number { return 100; }

    private maxSpeed(): number {

        switch(this.vehicleType) {
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
            case VehicleType.Killdozer:
                return 175;    
            case VehicleType.MonsterTruck:
                return 200;       
            case VehicleType.Police:
                return 220;              
            default:
                return 10;
        }
    }
    private maxTurboSpeed(): number { 
        switch(this.vehicleType) {
            case VehicleType.Ambulance:
                return this.maxSpeed() * 1.5;
            //case VehicleType.TrashMan:
                //return this.maxSpeed() * 1.5;
            case VehicleType.Taxi:
                return this.maxSpeed() * 1.5;
            case VehicleType.RaceCar:
                return this.maxSpeed() * 1.5;
            case VehicleType.Police:
                return this.maxSpeed() * 1.5;
            default:
                return this.maxSpeed() * 1.5;                
        }
    }

    private getDistanceBeforeStopping(): number { 
        switch(this.vehicleType) {
            case VehicleType.Ambulance:
                return 300;
            case VehicleType.Taxi:
                return 300;
            case VehicleType.RaceCar:
                return 300;
            case VehicleType.PickupTruck:
                return 300;
            case VehicleType.Police:
                return 300;
            case VehicleType.Hearse:
                return 300;
            case VehicleType.Killdozer:
                return 200;
            case VehicleType.MonsterTruck:
                return 200;
            default:
                return 200;
        }
    }

    private get GetTextOffsetY(): number { return -100; }

    turboBar: HealthBar;
    private turboOn: boolean = false;

    healthBar: HealthBar;
    private debugCoordinatesText: Phaser.GameObjects.Text;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private cpuIcon: Phaser.GameObjects.Image;
    private playerMarkerIcon: Phaser.GameObjects.Image;    

    private get GetPlayerNameOffsetX(): number { return 0; }
    private get GetPlayerNameOffsetY(): number { return -60; }

    private particleEmitterExplosion: Phaser.GameObjects.Particles.ParticleEmitter;
    private particleEmitterSparks: Phaser.GameObjects.Particles.ParticleEmitter;

    private particleEmitterTurbo: Phaser.GameObjects.Particles.ParticleEmitter;
    private turboLaunchPointOffsetLeft: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    private turboLaunchPointOffsetRight: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    private particleEmitterDeathBurn: Phaser.GameObjects.Particles.ParticleEmitter;

    private particleEmitterMuzzleFlash: Phaser.GameObjects.Particles.ParticleEmitter;

    public particleEmitterFlamethrower: Phaser.GameObjects.Particles.ParticleEmitter;

    public particleEmitterShockwave: Phaser.GameObjects.Particles.ParticleEmitter;

    public particleEmitterSmoke: Phaser.GameObjects.Particles.ParticleEmitter;

    private get emitterOffsetY(): number {return 30;}

    private arctangent: number = 0;
    private aimX: number = 0;
    private aimY: number = 0;

    private leftStickDistanceFromCenter: number = 0;

    // TODO: see if this can work with calculateAimTargetDirectionWithGamePad()
    private targetArctangent: number = 0;
    private targetAimX: number = 0;
    private targetAimY: number = 0;
    
    private bulletLaunchPointOffsetLeft: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    private bulletLaunchPointOffsetRight: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    //private bulletLaunchX1: number = 0;
    //private bulletLaunchY1: number = 0;

    //private bulletLaunchX2: number = 0;
    //private bulletLaunchY2: number = 0;

    private launchLeft: boolean = true;

    private drawScale: number = 1;

    public playerId: string;

    public team: PlayerTeam;

    private getPlayerTeamColor(): number {
        switch(this.team) {
            case PlayerTeam.Red:
                return 0xFF0000;
            case PlayerTeam.Blue:
                return 0x0000FF;
            case PlayerTeam.Green:
                return 0x00FF00;
            case PlayerTeam.Yellow:
            default:
                return 0xFFFF00;
        }
    }

    private cpuPlayerPattern: CpuPlayerPattern = CpuPlayerPattern.Follow;
    
    private cpuFleeDirection: PlayerDrawOrientation = PlayerDrawOrientation.E;

    private cpuDestination: Phaser.Math.Vector2;
    private cpuDestinationTargetIcon: Phaser.GameObjects.Image;
    private cpuDestinationTargetText: Phaser.GameObjects.Text;

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

    public airstrikeTime: number = 0;
    public airstrikeTimeInterval: number = 200;
    public activeAirstrike: Projectile;
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
        if(this.isCpuPlayer)
            this.cpuDestination = new Phaser.Math.Vector2(this.x, this.y);
        this.team = params.playerTeam;      

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
            this.maxHealth(), 
            50, 10,
            0.25,
            HUDBarType.Health);
        
        this.healthBar.setDepth(Constants.depthHealthBar);
        this.healthBar.show();

        this.turboBar = new HealthBar(this.scene)        
        this.turboBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 1.3,
            this.turbo, 
            50, 5,
            0.25,
            HUDBarType.Turbo);
        
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
        
        let playerTypeIcon = this.isCpuPlayer ? 'cpuIcon' : 'shieldIcon';
        this.cpuIcon = this.scene.add.image(
            this.x + this.GetPlayerNameOffsetX - 50, this.y + this.GetPlayerNameOffsetY,
            playerTypeIcon);
        this.cpuIcon.setOrigin(0.5, 0.5);
        this.cpuIcon.setScale(0.25);
        this.cpuIcon.alpha = 1;    
        this.cpuIcon.setDepth(Constants.depthHealthBar);
        this.cpuIcon.setVisible(this.isCpuPlayer);    
        this.cpuIcon.setTint(this.getPlayerTeamColor());

        if(this.isCpuPlayer) {
            this.cpuDestinationTargetIcon = this.scene.add.image(
                this.cpuDestination.x, this.cpuDestination.y,
                'crosshair');                        
            this.cpuDestinationTargetIcon.setTint(this.getPlayerTeamColor());

            this.cpuDestinationTargetText = this.scene.add.text(this.cpuDestination.x, this.cpuDestination.y, `${(this.playerId)} target: (${(this.cpuDestination.x).toFixed(2)}, ${(this.cpuDestination.y).toFixed(2)})`);

            this.playerMarkerIcon = this.scene.add.image(
                this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 0.5,
                'playerMarkerIcon');       
            this.playerMarkerIcon.setScale(0.25);
            this.playerMarkerIcon.setTint(this.getPlayerTeamColor());
        }

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
    
        var text = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, "",
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

        this.setCircle(this.bodyDrawSize(), this.bodyDrawOffset().x, this.bodyDrawOffset().y)
            
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

        this.particleEmitterMuzzleFlash = this.scene.add.particles(this.x, this.y, 'muzzleFlash', {            
            lifespan: 150,
            //speed: { min: -50, max: 50 },
            //tint: 0xff0000, 
            scale: {start: 0.5, end: 0.0},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0},
        });

        /*
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
        */

        this.particleEmitterTurbo = this.scene.add.particles(0, 0, 'smoke', {
            frame: 'white',
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quart.out',
            lifespan: 250,
            angle: { min: -100, max: -80 },
            scale: { start: 0.10, end: 0.5, ease: 'sine.in' },
            alpha: {start: 0.8, end: 0.0},
            speed: { min: 50, max: 100 },
            advance: 100,
            blendMode: 'ADD',
            emitting: false
        });

        this.particleEmitterSmoke = this.scene.add.particles(0, 0, 'smokeDarker', {
            color: [ 0x432244, 0x141315 ],
            //tint: 808080,
            colorEase: 'quart.out',
            lifespan: 500,
            angle: { min: -100, max: -80 },
            scale: { start: 0.25, end: 1, ease: 'sine.in' },
            alpha: {start: 0.8, end: 0.0},
            speed: { min: 50, max: 100 },
            advance: 0,
            blendMode: 'ADD',
            quantity: 2,
            emitting: false
    
            /*
            //frame: 'white',
            color: [ 0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404 ],
            lifespan: 500,
            angle: { min: -100, max: -80 },
            scale: { start: 0.25, end: 1, ease: 'sine.in' },
            alpha: {start: 0.8, end: 0.0},
            speed: { min: 50, max: 100 },
            advance: 2000,
            blendMode: 'ADD',
            emitting: false
            */
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

    updateCpuBehavior(playerPosition: Phaser.Math.Vector2, cpuPlayerPatternOverride: CpuPlayerPattern): void {
        if(this.isCpuPlayer) {
        
            if(cpuPlayerPatternOverride != null) {
                
                if(cpuPlayerPatternOverride == CpuPlayerPattern.Patrol && this.cpuPlayerPattern != CpuPlayerPattern.Patrol) {
                    var randX = Utility.getRandomInt(200) - 100;
                    var randY = Utility.getRandomInt(200) - 100;
                    this.cpuDestination = Utility.cartesianToIsometric(new Phaser.Math.Vector2(playerPosition.x, playerPosition.y));
                }

                this.cpuPlayerPattern = cpuPlayerPatternOverride;
            }
            else {
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
                if(changeBehaviorRand == 5) {
                    this.cpuPlayerPattern = CpuPlayerPattern.Patrol;

                    var randX = Utility.getRandomInt(2000) - 1000;
                    var randY = Utility.getRandomInt(2000) - 1000;
                    this.cpuDestination = Utility.cartesianToIsometric(new Phaser.Math.Vector2(this.x + randX, this.y + randY));
                }

                if(this.health / this.maxHealth() < 0.3 && changeBehaviorRand > 475)
                    this.cpuPlayerPattern = CpuPlayerPattern.Flee;
            }
            
            var turboRand = Utility.getRandomInt(25);
                if(turboRand == 0 &&
                    (this.cpuPlayerPattern == CpuPlayerPattern.Flee
                    || this.cpuPlayerPattern == CpuPlayerPattern.Follow
                    || this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack)) {
                        this.tryTurboBoostOn();
                    }
                        
            // distance behavior
            if(this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack
                && Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, this.x, this.y) < this.getDistanceBeforeStopping()) {
                this.cpuPlayerPattern = CpuPlayerPattern.StopAndAttack;
            }   

            if(this.cpuPlayerPattern == CpuPlayerPattern.Follow
                && Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, this.x, this.y) < this.getDistanceBeforeStopping()) {
                this.cpuPlayerPattern = CpuPlayerPattern.Stop;
            }

            if(this.cpuPlayerPattern == CpuPlayerPattern.Patrol) {
                //&& Phaser.Math.Distance.Between(this.cpuDestination.x, this.cpuDestination.y, this.x, this.y) < 500) {
                
                //        -1 PI  1 PI 
                //   -0.5PI           0.5 PI
                //         0 PI  0 PI

                this.arctangent += 0.01 * Math.PI;
                if(this.arctangent > Math.PI)
                    this.arctangent = - Math.PI;
                this.setPlayerDrawOrientation();
                this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  

                /*
                    //this.cpuPlayerPattern = CpuPlayerPattern.Stop;
                if(this.playerDrawOrientation == PlayerDrawOrientation.W_NW)
                    this.playerDrawOrientation = PlayerDrawOrientation.W;
                else
                    this.playerDrawOrientation++;
                */

            }
        
            // movement
            switch(this.cpuPlayerPattern){
                case CpuPlayerPattern.Flee:
                    //this.tryAimWithGamepad(playerX, playerY); // TODO: try move AWAY from location
                    this.tryAccelerateInAimDirection();
                    break;
                case CpuPlayerPattern.FollowAndAttack:
                    this.cpuDestination = playerPosition;
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);
                    this.tryMoveToLocation(playerPosition.x, playerPosition.y);                    
                    break;
                case CpuPlayerPattern.Follow:
                    this.cpuDestination = playerPosition;
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);
                    this.tryMoveToLocation(playerPosition.x, playerPosition.y);
                    break;
                case CpuPlayerPattern.StopAndAttack:
                    this.cpuDestination = playerPosition;
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);    
                    this.tryStopMove();                    
                    break;
                case CpuPlayerPattern.Stop:
                    this.tryStopMove();
                    break;
                case CpuPlayerPattern.Patrol:                                                           
                    //this.tryMoveToLocation(this.cpuDestination.x, this.cpuDestination.y);
                    //this.tryAimAtLocation(this.cpuDestination.x, this.cpuDestination.y);
                  
                    //this.cpuDestination = playerPosition;
                    this.calculateAimDirection(this.playerDrawOrientation);
                    this.tryAccelerateInAimDirection();

                    //this.cpuDestination = new Phaser.Math.Vector2(this.x + this.aimX * 40, this.y + this.aimY * 40);
                    break;
                default:
                    break;
            }       
                                       
            if(this.isCpuPlayer) {
                this.cpuDestinationTargetIcon.setPosition(this.cpuDestination.x, this.cpuDestination.y);
                this.cpuDestinationTargetText.setPosition(this.cpuDestination.x, this.cpuDestination.y);
                this.cpuDestinationTargetText.setText(`${(this.playerId)} target: (${(this.cpuDestination.x).toFixed(2)}, ${(this.cpuDestination.y).toFixed(2)})`);
            }
            
            // weapon behavior
            if(this.cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack
                || this.cpuPlayerPattern == CpuPlayerPattern.StopAndAttack) {
                    var weaponRand = Utility.getRandomInt(25);
                    if(weaponRand <= 5) this.tryFirePrimaryWeapon();
                    if(weaponRand >= 10 && weaponRand <= 12) this.tryFireSecondaryWeapon();
                    if(weaponRand == 20) this.tryFireShockwave();
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

            this.setDepth(this.y);

            /*
            if(this.isCpuPlayer) {
                this.path.getPoint(this.pathIndex, this.pathVector);

                this.setPosition(this.pathVector.x, this.pathVector.y);
        
                this.pathIndex = Phaser.Math.Wrap(this.pathIndex + this.pathSpeed, 0, 1);
            }
            */

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

            this.particleEmitterFlamethrower.setDepth(this.y);

            this.particleEmitterMuzzleFlash.setPosition(this.x, this.y);
            this.particleEmitterMuzzleFlash.setDepth(this.y);

            if(this.health <= 0.25 * this.maxHealth()) {
                this.particleEmitterSmoke.setDepth(this.y + 64);
                this.particleEmitterSmoke.emitParticleAt(this.x, this.y);        
            }            
            //this.particleEmitterExplosion.setDepth(this.y + 1000);
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

        if(this.airstrikeTime > 0)
            this.airstrikeTime--;
    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setText(`${this.playerId}`)
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0.5, 0.5);

        //if(this.isCpuPlayer && this.cpuIcon != null)
        if(this.cpuIcon != null)
            this.cpuIcon.setPosition(x - 50, y);

        if(this.playerMarkerIcon != null)
            this.playerMarkerIcon.setPosition(x, y - 20);
        //text.setAlign('center');
    }

    alignDebugText(x: number, y: number) {
        var text = this.debugCoordinatesText;

        text.setText(`Map(${(this.MapPosition.x).toFixed(2)}, ${(this.MapPosition.y).toFixed(2)}) 
                    Iso(${(this.x).toFixed(2)}, ${(this.y).toFixed(2)})
                    \nVelocity(${(this.body.velocity.x).toFixed(2)}, ${(this.body.velocity.y).toFixed(2)})
                    \n@ Tile(${(this.playerPositionOnTileset.x).toFixed(2)}, ${(this.playerPositionOnTileset.y).toFixed(2)})    
                    \n atan ${(this.arctangent / Math.PI).toFixed(2)} PI
                    \n target atan ${(this.targetArctangent / Math.PI).toFixed(2)} PI
                    \n gamepad distance ${(this.leftStickDistanceFromCenter).toFixed(2)}
                    \n Aim (${(this.aimX / Math.PI).toFixed(2)} PI, ${(this.aimY / Math.PI).toFixed(2)} PI)
                    \n Behavior: ${this.cpuPlayerPattern.toString()}
                    \n Depth: ${this.depth.toString()}`)

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
        this.targetArctangent = arctangent;

        this.setPlayerDrawOrientation();

        this.calculateAimDirection(this.playerDrawOrientation);
    }

    // TODO: see if this can work
    calculateAimTargetDirectionWithGamePad(x: number, y: number): void {
        var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
            
        this.targetArctangent = Utility.SnapTo16DirectionAngle(Math.atan2(isometricGamepadAxes.x, isometricGamepadAxes.y));
        
        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI


        // -0.99 PI -> 1.01 PI
        // -0.75 PI -> 1.25 PI
        // -0.5 PI -> 0.5 PI        
        
        /*
        if(//this.targetArctangent < -0.5 * Math.PI && this.arctangent > 0.5 * Math.PI
           (Math.abs(this.targetArctangent - this.arctangent) >= 1 ||
               Math.abs(-this.targetArctangent + this.arctangent) >= 1) {

            this.targetArctangent = Math.PI + (Math.PI - Math.abs(this.targetArctangent))
        }*/

        let newArctangent = this.arctangent;

        let useAllPositiveAtan = false;
        let useAllNegativeAtan = false;

        // adjust atan scale so that it's all positive
        if (this.arctangent > 0 && this.targetArctangent < 0)
            useAllPositiveAtan = true;
        
        // adjust atan scale so that it's all negative
        if (this.arctangent < 0 && this.targetArctangent > 0)
            useAllNegativeAtan = true;
            
        // -0.99 PI -> 1.01 PI
        // -0.75 PI -> 1.25 PI
        // -0.5 PI -> 0.5 PI    
        if(useAllPositiveAtan)
            this.targetArctangent = Math.PI + (Math.PI - Math.abs(this.targetArctangent))

        // 1.01 PI -> -0.99 PI
        // 1.25 PI -> -0.75 PI
        // 1.5 PI -> -0.5 PI
        if(useAllNegativeAtan)
            this.targetArctangent = -Math.PI + (Math.PI - Math.abs(this.targetArctangent));
        
        //if(Math.abs(newArctangent) - (Math.abs(this.targetArctangent)) {
            //this.arctangent = this.targetArctangent
        //}
        //else {
            if(this.arctangent < this.targetArctangent)
                newArctangent += (1/8)*Math.PI;

            if(this.arctangent > this.targetArctangent)
                newArctangent -= (1/8)*Math.PI;
              
            /*
            if(Math.abs(this.targetArctangent - this.arctangent) >= 1 ||
               Math.abs(-this.targetArctangent + this.arctangent) >= 1) {
                if(this.arctangent < 0 && newArctangent > 0) {
                    newArctangent -= (1/8)*Math.PI;
                    if(Utility.SnapTo16DirectionAngle(newArctangent) == -Math.PI)
                        newArctangent = Math.PI;
                }
                else if(this.arctangent > 0 && newArctangent < 0) {
                    newArctangent += (1/8)*Math.PI;
                    if(Utility.SnapTo16DirectionAngle(newArctangent) == Math.PI)
                        newArctangent = -Math.PI;
                }                
            }
            */
        //}

        //////////////////////////////////////////////////////////////////
        // reset newArctangent and targetArctangent back to normal range
        //////////////////////////////////////////////////////////////////

        // 1.01 PI -> -0.99 PI
        // 1.25 PI -> -0.75 PI
        // 1.5 PI -> -0.5 PI
        if(useAllPositiveAtan) {
            if(newArctangent > Math.PI)
                newArctangent = -Math.PI + (Math.PI - Math.abs(newArctangent));

            if(this.targetArctangent > Math.PI)
                this.targetArctangent = -Math.PI + (Math.PI - Math.abs(this.targetArctangent));
        }

        // -0.99 PI -> 1.01 PI
        // -0.75 PI -> 1.25 PI
        // -0.5 PI -> 0.5 PI    
        if(useAllNegativeAtan) {
            if(newArctangent < -Math.PI)
                newArctangent = Math.PI - (Math.PI - Math.abs(newArctangent));

            if(this.targetArctangent < -Math.PI)
                this.targetArctangent = Math.PI - (Math.PI - Math.abs(this.targetArctangent));
        }
                   
        this.arctangent = Utility.SnapTo16DirectionAngle(newArctangent);//Utility.SnapTo16DirectionAngle(arctangent);        
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

        this.bulletLaunchPointOffsetLeft = new Phaser.Math.Vector2(Math.cos(angle2 - Math.PI / 12), Math.sin(angle2 - Math.PI / 12));
        this.bulletLaunchPointOffsetRight = new Phaser.Math.Vector2(Math.cos(angle2 + Math.PI / 12), Math.sin(angle2 + Math.PI / 12));

        this.turboLaunchPointOffsetLeft = new Phaser.Math.Vector2(Math.cos(angle2 - Math.PI / 12), Math.sin(angle2 - Math.PI / 12));
        this.turboLaunchPointOffsetRight = new Phaser.Math.Vector2(Math.cos(angle2 + Math.PI / 12), Math.sin(angle2 + Math.PI / 12));

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

    // only used with ControlStyle.LeftStickAims
    tryAimWithGamepad(x: number, y: number) {

        if(this.deadUntilRespawnTime > 0) return;

        this.calculateAimDirectionWithGamePad(x, y);
        
        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  
    }

    tryAccelerateInAimDirection() {

        if(this.deadUntilRespawnTime > 0) return;

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   
    }

    // used with ControlStyle.LeftStickAimsAndMoves
    tryAimAndMoveWithGamepad(x: number, y: number, leftAxisX: number, leftAxisY: number) {

        if(this.deadUntilRespawnTime > 0) return;

        this.calculateAimDirectionWithGamePad(x, y);

        let speedMultiplier = Math.abs(Phaser.Math.Distance.Between(leftAxisX, leftAxisY, 0, 0));
        if(speedMultiplier > 1) speedMultiplier = 1;

        this.leftStickDistanceFromCenter = speedMultiplier;
        //this.calculateAimTargetDirectionWithGamePad(x, y);
        
        this.body.velocity.x = this.aimX * this.getPlayerSpeed() * speedMultiplier;
        this.body.velocity.y = this.aimY * this.getPlayerSpeed() * speedMultiplier;   

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
        
        if(this.cpuIcon != null)
            this.cpuIcon.setVisible(false);

        if(this.playerMarkerIcon != null)
            this.playerMarkerIcon.setVisible(false);

        this.particleEmitterExplosion.setPosition(this.x, this.y);
        this.particleEmitterExplosion.setDepth(this.y + 64);
        this.particleEmitterExplosion.explode(20);//, this.x, this.y);

        this.particleEmitterDeathBurn.setPosition(this.x, this.y);
        this.particleEmitterDeathBurn.start(0, 1000);

        this.deathBurnSpotlight.setPosition(this.x, this.y);
        this.deathBurnSpotlight.setVisible(true);

        //this.particleEmitterSmoke.stop();

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

        let gameScene = <GameScene>this.scene;          
        let respawnPoint = gameScene.getRandomRespawnPoint();

        this.x = respawnPoint.x;
        this.y = respawnPoint.y;

        //this.body.position.x = this.MapPosition.x;
        //this.body.position.y = this.MapPosition.y;

        //this.MapPosition.x += this.body.velocity.x;
        //this.MapPosition.y += this.body.velocity.y;

        //var screenPosition = Utility.cartesianToIsometric(this.MapPosition);
        //this.playerPositionOnTileset = Utility.getTileCoordinates(this.MapPosition, Constants.isometricTileHeight);

        //this.x = screenPosition.x;
        //this.y = screenPosition.y;

        this.health = this.maxHealth();
        this.healthBar.updateHealth(this.health);
        this.healthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);
        this.healthBar.show();

        this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);        

        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
        this.tryTurboBoostOff();
        this.turboBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY * 0.5);
        this.turboBar.show();
        this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);

        this.deadUntilRespawnTime = 0;

        this.deathIcon.setVisible(false);

        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);    

        this.setVisible(true);
        
        this.turboBar.setVisible(true);
        this.healthBar.setVisible(true);
        this.multiplayerNameText.setVisible(true);
        //if(this.isCpuPlayer)
        this.cpuIcon.setVisible(true);
        
        if(this.isCpuPlayer)
            this.playerMarkerIcon.setVisible(true);

        this.particleEmitterDeathBurn.emitting = false;
        if(this.deathBurnSpotlight != null)
            this.deathBurnSpotlight.setVisible(false);

        this.headlight.setVisible(true);

        this.scene.events.emit('playerRespawn', this.playerId);
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
        //this.body.velocity.x = 0;
        //this.body.velocity.y = 0;

        this.body.velocity.x *= 0.97;
        this.body.velocity.y *= 0.97;

        this.tryTurboBoostOff();
    }

   
    tryDamage(projectileType: ProjectileType, damageLocation: Phaser.Math.Vector2): void {

        var explosionLocation = new Phaser.Math.Vector2((this.x + damageLocation.x) / 2, (this.y + damageLocation.y)/2)
        switch(projectileType)
        {            
            case ProjectileType.Bullet:
                this.health--;
                this.particleEmitterSparks.setPosition(explosionLocation.x, explosionLocation.y);
                this.particleEmitterSparks.setDepth(explosionLocation.y + 64);
                this.particleEmitterSparks.explode(5);//, this.x, this.y);
                break;
            case ProjectileType.FireRocket:
            case ProjectileType.HomingRocket:
                this.health -= 5;
                this.particleEmitterExplosion.setPosition(explosionLocation.x, explosionLocation.y);
                this.particleEmitterExplosion.setDepth(explosionLocation.y + 64);
                this.particleEmitterExplosion.explode(10);//, this.x, this.y);
                break;
            case ProjectileType.Airstrike:
                this.health -= 2;
                break;
        }

        /*
        if(this.health <= 0.25 * this.maxHealth()) {

            //this.particleEmitterSmoke.emitting = true;// .emitParticleAt(this.x - this.turboLaunchPointOffsetLeft.x * distance, this.y - this.turboLaunchPointOffsetLeft.y * distance);        
            this.particleEmitterSmoke.setPosition(this.x, this.y);
            this.particleEmitterSmoke.start();

            this.particleEmitterFlamethrower.emitParticleAt(this.x, );                       
            
            //this.particleEmitterExplosion.explode(10);//, this.x, this.y);
        }
        */
        
        this.healthBar.updateHealth(this.health);
        this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);

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
            this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);
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
            
            this.createProjectile(ProjectileType.HomingRocket);

            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    tryFireFlamethrower() {

        if(this.deadUntilRespawnTime > 0) return;

        this.particleEmitterFlamethrower.setDepth(this.y);

        let minDistance = 30;

        if(this.flamethrowerDistance < this.getMaxFlamethrowerDistance())
            this.flamethrowerDistance += 10;
        
        for(var i = 0; i < 10; i++) {
            var distance = minDistance + Utility.getRandomInt(this.flamethrowerDistance);
            this.particleEmitterFlamethrower.emitParticleAt(this.x + this.aimX * distance, this.y + this.aimY * distance);                       
        }    
    }  

    tryFireShockwave() {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.shockwaveTime) {
            

            this.particleEmitterShockwave.explode(2);
            
            this.shockwaveTime = gameTime + this.shockwaveTimeInterval;
        }
    }  

    tryStopFireFlamethrower() {
        
        if(this.flamethrowerDistance > 0)
            this.flamethrowerDistance -= 10;
    }

    tryFireAirstrike(): void {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.airstrikeTime) {
            
            if(this.activeAirstrike == null || this.activeAirstrike.detonated == true)  {
                this.activeAirstrike = this.createProjectile(ProjectileType.Airstrike);//this.playerOrientation);

                this.airstrikeTime = gameTime + this.airstrikeTimeInterval;
            }
            else {               
                this.activeAirstrike.detonate();
                this.airstrikeTime = gameTime + this.airstrikeTimeInterval
            }
        }
    }

    tryTurboBoostOn(): void {
        
        if(this.deadUntilRespawnTime > 0) return;

        if(this.turbo > 0) {
            this.turboOn = true;
                
            this.turbo--;
            this.turboBar.updateHealth(this.turbo);
            this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);

            var distance = 15;
            this.particleEmitterTurbo.emitParticleAt(this.x - this.turboLaunchPointOffsetLeft.x * distance, this.y - this.turboLaunchPointOffsetLeft.y * distance);        
            this.particleEmitterTurbo.emitParticleAt(this.x - this.turboLaunchPointOffsetRight.x * distance, this.y - this.turboLaunchPointOffsetRight.y * distance);                    
        }        
        else {
            this.turboOn = false;
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
            
            this.createProjectile(ProjectileType.Bullet);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    tryFirePrimaryWeaponWithGamepad() { //x, y) {

        if(this.deadUntilRespawnTime > 0) return;

        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            this.createProjectile(ProjectileType.HomingRocket);
            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    refillTurbo() {
        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
        this.scene.events.emit('updatePlayerTurbo', this.playerId, this.turbo);
    }

    refillHealth() {
        this.health = this.maxHealth();
        this.healthBar.updateHealth(this.health);
        this.scene.events.emit('updatePlayerHealth', this.playerId, this.health);
    }

    trySelectPreviousWeapon() {
        this.scene.events.emit('previousWeaponSelected', this.playerId, this.turbo);
    }
    
    trySelectNextWeapon() {
        this.scene.events.emit('nextWeaponSelected', this.playerId, this.turbo);
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
            case ProjectileType.Airstrike:
                bulletVelocity = 500;    
                weaponImageKey = "deathIcon";
                scaleX = 1.25;
                scaleY = 1.25;
                break;
        }            

        velocityX = this.aimX * bulletVelocity;
        velocityY = this.aimY * bulletVelocity;

        var screenPosition = Utility.cartesianToIsometric(this.MapPosition);        
        
        var bulletLaunchDistanceFromPlayerCenter = 22;

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
       var launchPoint = new Phaser.Math.Vector2(this.aimX, this.aimY);
       if(projectileType == ProjectileType.Bullet) {
            this.launchLeft = !this.launchLeft;
            
            if(this.launchLeft)
                launchPoint = this.bulletLaunchPointOffsetLeft;
            else
                launchPoint = this.bulletLaunchPointOffsetRight;

            //this.particleEmitterMuzzleFlash.setPosition(this.x + launchPoint.x * launchDistanceFromPlayerCenter, this.y + launchPoint.y * launchDistanceFromPlayerCenter);

            this.particleEmitterMuzzleFlash.setPosition(this.x, this.y);
            this.particleEmitterMuzzleFlash.setDepth(this.y + launchPoint.y * bulletLaunchDistanceFromPlayerCenter);            
            this.particleEmitterMuzzleFlash.explode(1, launchPoint.x * bulletLaunchDistanceFromPlayerCenter, launchPoint.y * bulletLaunchDistanceFromPlayerCenter);               

            //this.particleEmitterMuzzleFlash.emitParticleAt(this.x + launchPoint.x * launchDistanceFromPlayerCenter, this.y + launchPoint.y * launchDistanceFromPlayerCenter);               
       }

        var bullet = new Projectile({
            scene: this.scene,
            projectileType: projectileType,
            isometricX: this.x + launchPoint.x * bulletLaunchDistanceFromPlayerCenter, //screenPosition.x, //body.x + this.playerBulletOffsetX(),
            isometricY: this.y + launchPoint.y * bulletLaunchDistanceFromPlayerCenter, //screenPosition.y, //body.y + this.getBulletOffsetY(),
            mapPositionX: this.MapPosition.x,
            mapPositionY: this.MapPosition.y,
            key: weaponImageKey,
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