import * as Phaser from 'phaser';
import { Constants } from '../../constants';
import { HealthBar, HUDBarType } from './../healthBar';
import { Projectile } from '../weapons/projectile';
import { Point, Utility } from '../../utility';
import GameScene from '../../scenes/gameScene';
import { CpuPlayerPattern } from './cpuPlayerPatternEnums';
import { PlayerDrawOrientation } from './playerDrawOrientation';
import { CpuPlayerBehavior } from './cpuPlayerBehavior';
import { AutoDecrementingGameTimer } from '../autoDecrementingGameTimer';
import { GameTimeDelayTimer } from '../gameTimeDelayTimer';
import { PlayerWeaponInventoryItem } from './playerWeaponInventoryItem';
import { PickupType } from '../pickup';
import { ProjectileFactory } from '../weapons/projectileFactory';
import { ProjectileType } from '../weapons/projectileType';
import { v4 as uuidv4 } from 'uuid';

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

export enum RockLaunchOffset {
    Left,
    Center,
    Right
}

export abstract class Player extends Phaser.Physics.Arcade.Sprite {

    protected abstract bodyDrawSize(): number;
    protected abstract bodyDrawOffset(): Phaser.Math.Vector2;

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

    public abstract maxHealth(): number;
    public static get maxShield(): number { return 4; }
    public static get maxTurbo(): number { return 100; }

    protected abstract maxSpeed(): number;
    
    private maxTurboSpeed(): number { 
        return this.maxSpeed() * 1.5;        
    }

    private maxFrozenTime(): number { 
        return 100;
    }

    private freezeTransitionTime(): number { 
        return 30;
    }

    private maxFreezeAlpha(): number { 
        return 0.7;
    }

    protected abstract getDistanceBeforeStopping();

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

    private frozenCarSprite: Phaser.GameObjects.Sprite;

    private lightningSprites: Phaser.GameObjects.Sprite[] = [];
    private lightningAngle: number = 0;

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

    private lastRockLaunchPointOffset: RockLaunchOffset = RockLaunchOffset.Center;    
    private rockLaunchPointOffsetLeft: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    private rockLaunchPointOffsetCenter: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);
    private rockLaunchPointOffsetRight: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);

    //private bulletLaunchX1: number = 0;
    //private bulletLaunchY1: number = 0;

    //private bulletLaunchX2: number = 0;
    //private bulletLaunchY2: number = 0;

    private launchLeft: boolean = true;

    private drawScale: number = 1;

    public playerId: uuidv4;
    public playerName: string;

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

    private otherPlayers: Phaser.GameObjects.GameObject[] = [];//Player[] = [];


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

    private projectileFactory: ProjectileFactory = new ProjectileFactory();
    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    
    public nextBulletTimer: GameTimeDelayTimer = new GameTimeDelayTimer(100);
    public nextRocketTimer: GameTimeDelayTimer = new GameTimeDelayTimer(500);
    public nextSpecialTimer: GameTimeDelayTimer = new GameTimeDelayTimer(500);

    //public airstrikeTime: number = 0;
    //public airstrikeTimeInterval: number = 200;
    public airStrikeTimer: GameTimeDelayTimer = new GameTimeDelayTimer(200);
    public activeAirstrike: Projectile;
    //private bulletVelocity: number = 7;

    public nextshockwaveTimer: GameTimeDelayTimer = new GameTimeDelayTimer(1000);
    public activeLightningTimer: AutoDecrementingGameTimer = new AutoDecrementingGameTimer(300);

    public frozenTimer: AutoDecrementingGameTimer;

    //public deadUntilRespawnTime: number = 0;
    public deadUntilRespawnTimer: AutoDecrementingGameTimer = new AutoDecrementingGameTimer(Constants.respawnTime);

    public MapPosition: Phaser.Geom.Point;
    public playerPositionOnTileset: Phaser.Geom.Point;

    public vehicleType: VehicleType;
    public animPrefix: string;

    private isCpuPlayer: boolean;
    private cpuPlayerBehavior: CpuPlayerBehavior;

    deathIcon: Phaser.GameObjects.Image;
    deathIconScale: number = 0.5;
    private static get deathIconOffsetX(): number {return 0;}
    private static get deathIconOffsetY(): number {return 0;}

    weaponInventoryItems: PlayerWeaponInventoryItem[] = [];
    selectedWeaponInventoryItem: PlayerWeaponInventoryItem;
    selectedWeaponInventoryItemIndex: integer = 0;

    constructor(params) {
        super(params.scene, params.mapX, params.mapY, params.key, params.frame);

        this.isCpuPlayer = params.isCpuPlayer;

        this.team = params.playerTeam;      

        var utilities = new Utility();
        //this.ScreenLocation = utilities.MapToScreen(params.mapX, params.mapY);
        //super(params.scene,  this.ScreenLocation.x, this.ScreenLocation.y, params.key, params.frame);

        //let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        this.MapPosition = new Phaser.Geom.Point(params.mapX, params.mapY); 
        this.playerPositionOnTileset = new Phaser.Geom.Point(0,0);

        this.playerId = uuidv4();
        this.playerName = params.playerId;

        this.vehicleType = params.vehicleType;
        this.drawScale = params.drawScale ?? 1;
        this.scale = this.drawScale;

        this.createAnims(params.scene);

        params.scene.anims.create({
            key: 'waveform',
            frames: [
                {key: 'waveform', frame: 'waveform1'},
                {key: 'waveform', frame: 'waveform2'},
                {key: 'waveform', frame: 'waveform3'},
                {key: 'waveform', frame: 'waveform4'}                
            ],
            frameRate: 10,
            repeat: -1
        });

        params.scene.anims.create({
            key: 'lightning',
            frames: [
                {key: 'lightning', frame: 'thunder-rays1'},
                {key: 'lightning', frame: 'thunder-rays2'},
                {key: 'lightning', frame: 'thunder-rays3'},
                {key: 'lightning', frame: 'thunder-rays4'},
                {key: 'lightning', frame: 'thunder-rays5'},
                {key: 'lightning', frame: 'thunder-rays6'}
            ],
            frameRate: 60,
            repeat: -1
        });
        /*
        params.scene.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
            frameRate: 10,
        });
        params.scene.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
            frameRate: 10,
        });
        */

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
        var playerNameText = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.playerName,
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
            
            let cpuDestination = new Phaser.Math.Vector2(this.x, this.y);
            let cpuDestinationTargetIcon = this.scene.add.image(
                cpuDestination.x, cpuDestination.y,
                'crosshair');                        
            cpuDestinationTargetIcon.setTint(this.getPlayerTeamColor());

            let cpuDestinationTargetText = this.scene.add.text(cpuDestination.x, cpuDestination.y,
                `${(this.playerName)} target: (${(cpuDestination.x).toFixed(2)}, ${(cpuDestination.y).toFixed(2)})`);

            this.cpuPlayerBehavior = new CpuPlayerBehavior(this.playerId, this.playerName, cpuDestination, cpuDestinationTargetIcon, cpuDestinationTargetText);
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

        
        this.frozenCarSprite = params.scene.add.sprite(params.scene, params.mapX, params.mapY, params.key, params.frame);
        //this.frozenCarSprite.anims.play('select-police', true);
        this.frozenCarSprite.anims.play(this.anims.getName(), true);
        // '', frame: '
        //this.frozenCarSprite.setTint(0x6FE4FF);
        this.frozenCarSprite.setTintFill(0x6FE4FF)
        this.frozenCarSprite.setAlpha(this.maxFreezeAlpha());
        //this.frozenCarSprite.setBlendMode(Phaser.BlendModes.SCREEN);
        this.frozenCarSprite.setScale(this.scaleX * 1.3, this.scaleY * 1.3);
        this.frozenCarSprite.setDepth(this.depth + this.bodyDrawOffset().y + 1);

        this.frozenTimer = new AutoDecrementingGameTimer(this.maxFrozenTime(), this.freezeTransitionTime(), this.freezeTransitionTime());

        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Special, 3));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Rocket, 3));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Flamethrower, 100));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Airstrike, 1));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Shockwave, 2));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Freeze, 1));
        this.weaponInventoryItems.push(new PlayerWeaponInventoryItem(PickupType.Lightning, 22));

        this.selectedWeaponInventoryItemIndex = 0;
        this.selectedWeaponInventoryItem = this.weaponInventoryItems[this.selectedWeaponInventoryItemIndex];
        
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

        /*
        let gameScene = <GameScene>(this.scene);
        this.otherPlayers = gameScene.getOtherPlayers(this.playerId);

            if(this.otherPlayers.length > 0) {
            this.otherPlayers.forEach(x => {
                let otherPlayer = <Player>x;

                this.createLightning(otherPlayer.playerId);
            });
        }
        */

        this.setPlayerDrawOrientation();
        this.calculateAimDirection(this.playerDrawOrientation);
    }

    abstract createAnims(scene: Phaser.Scene);

    updateCpuBehavior(playerPosition: Phaser.Math.Vector2, cpuPlayerPatternOverride: CpuPlayerPattern, cpuSelectedWeaponOverride: PickupType): void {
        if(this.isCpuPlayer) {
        
            if(cpuPlayerPatternOverride != null) {
                
                if(cpuPlayerPatternOverride == CpuPlayerPattern.Patrol && this.cpuPlayerBehavior.getCpuPlayerPattern() != CpuPlayerPattern.Patrol) {
                    var randX = Utility.getRandomInt(200) - 100;
                    var randY = Utility.getRandomInt(200) - 100;
                    this.cpuPlayerBehavior.setCpuDestination(new Phaser.Math.Vector2(this.x, this.y));//Utility.cartesianToIsometric(new Phaser.Math.Vector2(playerPosition.x, playerPosition.y)));
                }

                this.cpuPlayerBehavior.setCpuPlayerPattern(cpuPlayerPatternOverride);
            }
            else {
                // TODO: move into behavior class

                var changeBehaviorRand = Utility.getRandomInt(500);
                if(changeBehaviorRand == 0) {
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Flee);

                    //this.cpuFleeDirection = <PlayerDrawOrientation>(Utility.getRandomInt(16));
                }
                if(changeBehaviorRand == 1)
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Follow);
                if(changeBehaviorRand == 2)
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.FollowAndAttack);
                if(changeBehaviorRand == 3)
                this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Stop);
                if(changeBehaviorRand == 4)                
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.StopAndAttack);
                if(changeBehaviorRand == 5) {
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Patrol);

                    //var randX = Utility.getRandomInt(2000) - 1000;
                    //var randY = Utility.getRandomInt(2000) - 1000;
                    //this.cpuPlayerBehavior.setCpuDestination(new Phaser.Math.Vector2(this.x, this.y));//Utility.cartesianToIsometric(new Phaser.Math.Vector2(playerPosition.x, playerPosition.y)));
                }
            }
                        
            // TODO: move into behavior class
            if(cpuPlayerPatternOverride == null && this.health / this.maxHealth() < 0.3 && changeBehaviorRand > 475)
                this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Flee);
                                    
            // distance behavior
            if(this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.FollowAndAttack
                && Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, this.x, this.y) < this.getDistanceBeforeStopping()) {
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.StopAndAttack);
            }   

            if(this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.Follow
                && Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y, this.x, this.y) < this.getDistanceBeforeStopping()) {
                    this.cpuPlayerBehavior.setCpuPlayerPattern(CpuPlayerPattern.Stop);
            }

            if(this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.Patrol) {
               
                //        -1 PI  1 PI 
                //   -0.5PI           0.5 PI
                //         0 PI  0 PI

                this.arctangent += 0.01 * Math.PI;
                if(this.arctangent > Math.PI)
                    this.arctangent = - Math.PI;

                this.setPlayerDrawOrientation();
                this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  
            }
        
            // movement
            let cpuPlayerPattern = this.cpuPlayerBehavior.getCpuPlayerPattern();

            if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

            switch(cpuPlayerPattern){
                case CpuPlayerPattern.Flee:
                    //this.tryAimWithGamepad(playerX, playerY); // TODO: try move AWAY from location
                    this.tryAccelerateInAimDirection();
                    this.cpuPlayerBehavior.setCpuDestination(new Phaser.Math.Vector2(this.x + this.aimX * 100, this.y + this.aimY * 100));
                    break;
                case CpuPlayerPattern.FollowAndAttack:
                    this.cpuPlayerBehavior.setCpuDestination(playerPosition);
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);
                    this.tryMoveToLocation(playerPosition.x, playerPosition.y);                    
                    break;
                case CpuPlayerPattern.Follow:
                    this.cpuPlayerBehavior.setCpuDestination(playerPosition);
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);
                    this.tryMoveToLocation(playerPosition.x, playerPosition.y);
                    break;
                case CpuPlayerPattern.StopAndAttack:
                    this.cpuPlayerBehavior.setCpuDestination(playerPosition);
                    this.tryAimAtLocation(playerPosition.x, playerPosition.y);    
                    this.tryStopMove();                    
                    break;
                case CpuPlayerPattern.Stop:
                    this.tryStopMove();
                    break;
                case CpuPlayerPattern.Patrol:                                                           
                    this.calculateAimDirection(this.playerDrawOrientation);
                    this.tryAccelerateInAimDirection();

                    this.cpuPlayerBehavior.setCpuDestination(new Phaser.Math.Vector2(this.x + this.aimX * 50, this.y + this.aimY * 50));
                    break;
                default:
                    break;
            }       

            var turboRand = Utility.getRandomInt(25);
            if(turboRand == 0 &&
                (this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.Flee
                    || this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.Follow
                    || this.cpuPlayerBehavior.getCpuPlayerPattern() == CpuPlayerPattern.FollowAndAttack)) {
                this.tryTurboBoostOn();
            }
                                       
            this.cpuPlayerBehavior.updateDebugElementsLocation()
            
            if(cpuSelectedWeaponOverride != null) {
                this.selectedWeaponInventoryItem = this.weaponInventoryItems.filter(x => x.pickupType == cpuSelectedWeaponOverride)[0];
            }

            // weapon behavior
            if(cpuPlayerPattern == CpuPlayerPattern.FollowAndAttack
                || cpuPlayerPattern == CpuPlayerPattern.StopAndAttack) {

                var weaponRand = Utility.getRandomInt(50);

                if(weaponRand == 0)
                    this.trySelectPreviousWeapon();
                if(weaponRand == 1)
                    this.trySelectNextWeapon();

                if(this.selectedWeaponInventoryItem.pickupType == PickupType.Flamethrower
                    && Phaser.Math.Distance.Between(this.x, this.y, playerPosition.x, playerPosition.y) < 500)
                    this.tryFirePrimaryWeapon();

                if(weaponRand >= 5 && weaponRand < 10) this.tryFirePrimaryWeapon();
                //if(weaponRand >= 10 && weaponRand <= 12) this.tryFireSecondaryWeapon();
                //if(weaponRand == 20) this.tryFireShockwave();
            }
        }
    }

    update(...args: any[]): void {
    
        if(!this.deadUntilRespawnTimer.isActive()) 
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

            //let angle2 = -this.arctangent;// + (Math.PI / 2)
            //this.electricBeamSprite.setPosition(this.x, this.y);
            //this.electricBeamSprite.rotation = angle2;

        
            //let electricBeamSpriteIndex = 0;

            this.activeLightningTimer.update();
            if(!this.activeLightningTimer.isActive()) {
                this.lightningSprites.forEach(x => {
                    let sprite = <Phaser.GameObjects.Sprite>x;
                    sprite.destroy();
                });
            }
            else {
                var otherPlayers = gameScene.getOtherPlayers(this.playerId);
                otherPlayers.forEach(x => {

                    var otherPlayer = <Player>x;
                    var distance = Math.abs(Phaser.Math.Distance.Between(otherPlayer.x, otherPlayer.y, this.x, this.y));
                        
                    if(distance < 200) {
                        //let gameScene = <GameScene>this.scene;  
                        var destinationX = otherPlayer.x;
                        var destinationY = otherPlayer.y;
                        var deltaX = destinationX - this.x;
                        var deltaY = destinationY - this.y;
                
                        //var isometricGamepadAxes = Utility.cartesianToIsometric(new Phaser.Geom.Point(x, y));
                        var arctangent = Math.atan2(deltaX, deltaY);
                        this.lightningAngle = -Utility.SnapTo16DirectionAngle(arctangent);
                    }
                    else {                
                        //this.lightningAngle = -this.arctangent;
                        
                        this.lightningAngle += Math.PI / 60;
                        if(this.lightningAngle > Math.PI * 2)
                            this.lightningAngle -= Math.PI * 2;
                    }
        
                    let matchingLightning = this.lightningSprites.filter(x => x.getData('otherPlayerId') == otherPlayer.playerId);
                    if(matchingLightning.length > 0) {
                        let lightning = matchingLightning[0];

                        lightning.setPosition(this.x, this.y);
                        lightning.rotation = this.lightningAngle;  
                        lightning.setVisible(true);  
                    }
                    /*
                    else {
                        let lightning = this.createLightning(otherPlayer.playerId);

                        lightning.setPosition(this.x, this.y);
                        lightning.rotation = this.lightningAngle;  
                        lightning.setVisible(true);
                    } 
                    */               
                    //var pickupParent = pickup.getData('parentId');

                    //this.electricBeamSprites[electricBeamSpriteIndex].setPosition(this.x, this.y);
                    //this.electricBeamSprites[electricBeamSpriteIndex].rotation = this.lightningAngle;    
                    //electricBeamSpriteIndex++;     
                });            
            }
        } 

        var currentlyDeadAndWaitingUntilRespawn = this.deadUntilRespawnTimer.isActive();
        this.deadUntilRespawnTimer.update();

        if (currentlyDeadAndWaitingUntilRespawn && !this.deadUntilRespawnTimer.isActive()){
            this.tryRespawn();
        }

        //if(this.airstrikeTime > 0)
            //this.airstrikeTime--;

        this.frozenTimer.update();

        if(this.frozenCarSprite != null) {
            if(this.frozenTimer.isActive() && !this.deadUntilRespawnTimer.isActive()) {
                this.frozenCarSprite.setVisible(true);
                this.frozenCarSprite.setPosition(this.x, this.y);
                this.frozenCarSprite.anims.play(this.anims.getName(), true);            
                this.frozenCarSprite.setDepth(this.depth + 1);

                /*
                if(this.frozenTime > this.maxFrozenTime() - this.freezeTransitionTime()) {
                    var freezeStartTime = (this.maxFrozenTime() - this.frozenTime);
                    this.frozenCarSprite.setAlpha((freezeStartTime / this.freezeTransitionTime()) * this.maxFreezeAlpha());
                }
                else if(this.frozenTime < this.freezeTransitionTime()) {
                    var freezeStartTime = (this.freezeTransitionTime() - this.frozenTime);
                    this.frozenCarSprite.setAlpha((1 - freezeStartTime / this.freezeTransitionTime()) * this.maxFreezeAlpha());
                }
                */

                if(this.frozenTimer.currentTime > this.maxFrozenTime() - this.freezeTransitionTime()) {
                    var freezeStartTime = (this.maxFrozenTime() - this.frozenTimer.currentTime);
                    this.frozenCarSprite.setAlpha((freezeStartTime / this.freezeTransitionTime()) * this.maxFreezeAlpha());
                }
                else if(this.frozenTimer.currentTime < this.freezeTransitionTime()) {
                    var freezeStartTime = (this.freezeTransitionTime() - this.frozenTimer.currentTime);
                    this.frozenCarSprite.setAlpha((1 - freezeStartTime / this.freezeTransitionTime()) * this.maxFreezeAlpha());
                }
            }
            else
                this.frozenCarSprite.setVisible(false);
        }
    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setText(`${this.playerName}`)
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

        text.setText(`${this.playerId}
                    \nMap(${(this.MapPosition.x).toFixed(2)}, ${(this.MapPosition.y).toFixed(2)}) 
                    Iso(${(this.x).toFixed(2)}, ${(this.y).toFixed(2)})
                    \nVelocity(${(this.body.velocity.x).toFixed(2)}, ${(this.body.velocity.y).toFixed(2)})
                    \n@ Tile(${(this.playerPositionOnTileset.x).toFixed(2)}, ${(this.playerPositionOnTileset.y).toFixed(2)})    
                    \n atan ${(this.arctangent / Math.PI).toFixed(2)} PI
                    \n target atan ${(this.targetArctangent / Math.PI).toFixed(2)} PI
                    \n gamepad distance ${(this.leftStickDistanceFromCenter).toFixed(2)}
                    \n Aim (${(this.aimX / Math.PI).toFixed(2)} PI, ${(this.aimY / Math.PI).toFixed(2)} PI)
                    \n Behavior: ${this.cpuPlayerBehavior?.getCpuPlayerPattern().toString() ?? 'none'}
                    \n Depth: ${this.depth.toString()}`)

        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0);
    }

    toggleShowDebugText(visible: boolean) {
        this.debugCoordinatesText.setVisible(visible);
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

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        //let angle2 = -this.arctangent + (Math.PI / 2) + (3 * Math.PI / 4);

        let angle2 = -this.arctangent + (Math.PI / 2);// + (3 * Math.PI / 4);

        //let angle2 = this.arctangent + (Math.PI / 2) - (3 * Math.PI / 4);
        this.aimX = Math.cos(angle2);
        this.aimY = Math.sin(angle2);

        this.bulletLaunchPointOffsetLeft = new Phaser.Math.Vector2(Math.cos(angle2 - Math.PI / 12), Math.sin(angle2 - Math.PI / 12));
        this.bulletLaunchPointOffsetRight = new Phaser.Math.Vector2(Math.cos(angle2 + Math.PI / 12), Math.sin(angle2 + Math.PI / 12));

        this.turboLaunchPointOffsetLeft = new Phaser.Math.Vector2(Math.cos(angle2 - Math.PI / 12), Math.sin(angle2 - Math.PI / 12));
        this.turboLaunchPointOffsetRight = new Phaser.Math.Vector2(Math.cos(angle2 + Math.PI / 12), Math.sin(angle2 + Math.PI / 12));

        this.rockLaunchPointOffsetLeft = new Phaser.Math.Vector2(Math.cos(angle2 - Math.PI / 3), Math.sin(angle2 - Math.PI / 3));
        this.rockLaunchPointOffsetCenter = new Phaser.Math.Vector2(Math.cos(angle2), Math.sin(angle2));
        this.rockLaunchPointOffsetRight = new Phaser.Math.Vector2(Math.cos(angle2 + Math.PI / 3), Math.sin(angle2 + Math.PI / 3));

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

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

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

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive()) return;

        this.calculateAimDirectionWithGamePad(x, y);
        
        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);  
    }

    tryAccelerateInAimDirection() {    
        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   
    }

    // used with ControlStyle.LeftStickAimsAndMoves
    tryAimAndMoveWithGamepad(x: number, y: number, leftAxisX: number, leftAxisY: number) {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

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

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.body.velocity.x = this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
    }

    tryMoveAwayFromLocation(destinationX: number, destinationY: number) {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        this.calculateAimDirectionByTarget(destinationX, destinationY);        

        this.body.velocity.x = -this.aimX * this.getPlayerSpeed();
        this.body.velocity.y = -this.aimY * this.getPlayerSpeed();   

        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);
    }

    tryAimAtLocation(destinationX: number, destinationY: number) {
       
        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        this.calculateAimDirectionByTarget(destinationX, destinationY);        
        this.playAnimFromPlayerDrawOrientation(this.playerDrawOrientation);       
    }

    tryKill() {
        //this.deadUntilRespawnTime = Constants.respawnTime;
        this.deadUntilRespawnTimer.startTimer();        

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

        this.frozenCarSprite.setVisible(false);

        this.deathIcon.setPosition(this.x + Player.deathIconOffsetX, this.y + Player.deathIconOffsetY);
        this.deathIcon.setVisible(true);

        this.activeLightningTimer.stopTimer();
        this.lightningSprites.forEach(x => {
            let sprite = <Phaser.GameObjects.Sprite>x;
            sprite.destroy();
        });
        
        this.numberDeaths++;

        let gameScene = <GameScene>this.scene;  

        gameScene.sceneController.hudScene.setInfoText(this.playerName + " destroyed (" + this.numberDeaths + " total)", 2000);
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

        this.deadUntilRespawnTimer.stopTimer();

        //this.frozenTime = 0;

        this.frozenTimer.stopTimer();

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
            case ProjectileType.Rocks:
                this.health -= 4;
                this.particleEmitterExplosion.setPosition(explosionLocation.x, explosionLocation.y);
                this.particleEmitterExplosion.setDepth(explosionLocation.y + 64);
                this.particleEmitterExplosion.explode(5);//, this.x, this.y);
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
        if(this.health <= 0 && !this.deadUntilRespawnTimer.isActive()){
            this.tryKill();
        }
    }

    tryFreeze() {
        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        //this.frozenTime = this.maxFrozenTime();
        this.frozenTimer.startTimer();

        this.frozenCarSprite.setVisible(true);
        this.frozenCarSprite.setAlpha(0);
        this.tryStopMove();
    }

    tryFireSecondaryWeapon() {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextBulletTimer.isExpired(gameTimeNow)) {
            
            this.createProjectile(ProjectileType.Bullet);
            this.nextBulletTimer.startTimer(gameTimeNow);
        }        
    }  
    
    tryFirePrimaryWeapon() {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var selectedWeapon = this.selectedWeaponInventoryItem;

        if(selectedWeapon != null && this.selectedWeaponInventoryItem.ammoCount > 0) {
            switch(selectedWeapon.pickupType) {
                case PickupType.Special:
                    this.tryFireRocks();
                    break;
                case PickupType.Rocket:
                    this.tryFireRocket();
                    break;
                case PickupType.Flamethrower:
                    this.tryFireFlamethrower();
                    break;
                case PickupType.Airstrike:
                    this.tryFireAirstrike();
                    break;
                case PickupType.Shockwave:
                    this.tryFireShockwave();
                    break;
                case PickupType.Freeze:
                    this.tryFireFreeze();
                    break;
                case PickupType.Lightning:
                    this.tryFireLightning();
                    break;
            }
        }        
    }  

    tryFireRocket() {
        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextRocketTimer.isExpired(gameTimeNow)) {
            
            this.createProjectile(ProjectileType.FireRocket);
            this.nextRocketTimer.startTimer(gameTimeNow);
        }        
    }

    tryFireFreeze() {
        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextRocketTimer.isExpired(gameTimeNow)) {
            
            this.createProjectile(ProjectileType.Freeze);
            this.nextRocketTimer.startTimer(gameTimeNow);
        }        
    }

    tryFireFlamethrower() {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

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

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextshockwaveTimer.isExpired(gameTimeNow)) {
            
            this.particleEmitterShockwave.explode(2);
            this.nextshockwaveTimer.startTimer(gameTimeNow);
        }        
    }  

    tryFireLightning() {
        if(!this.activeLightningTimer.isActive()) {

            this.activeLightningTimer.startTimer();


            this.lightningSprites.forEach(x => {
                let sprite = <Phaser.GameObjects.Sprite>x;
                sprite.destroy();
            });

            let gameScene = <GameScene>this.scene;   
            var otherPlayers = gameScene.getOtherPlayers(this.playerId);
            otherPlayers.forEach(x => {

                var otherPlayer = <Player>x;
                let lightning = this.createLightning(otherPlayer.playerId);

                lightning.setPosition(this.x, this.y);
                lightning.rotation = this.lightningAngle;  
                lightning.setVisible(true);
            });                    
        }
        // TODO: implement
    }

    tryStopFireFlamethrower() {        
        if(this.flamethrowerDistance > 0)
            this.flamethrowerDistance -= 10;
    }

    tryFireAirstrike(): void {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTime = this.scene.game.loop.time;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.airStrikeTimer.isExpired(gameTimeNow)) {
            if(this.activeAirstrike == null || this.activeAirstrike.detonated == true)  {
                this.activeAirstrike = this.createProjectile(ProjectileType.Airstrike);
                this.airStrikeTimer.startTimer(gameTimeNow);
            }
            else {               
                this.activeAirstrike.detonate();
                this.airStrikeTimer.startTimer(gameTimeNow);
            }
        }       
    }
    
    tryFireRocks() {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextSpecialTimer.isExpired(gameTimeNow)) {
            
            for(var i = 0; i < 10; i++) {
                this.createProjectile(ProjectileType.Rocks);
            }
            //this.createProjectile(ProjectileType.Rocks);
            //this.createProjectile(ProjectileType.Rocks);
            //this.createProjectile(ProjectileType.Rocks);
            this.nextSpecialTimer.startTimer(gameTimeNow);
        }        
    }  

    tryTurboBoostOn(): void {
        
        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

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

        //if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        if(this.turboOn) {
            this.turboOn = false;            
        }
    }

    tryFireSecondaryWeaponWithGamepad() { //x, y) {

        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextBulletTimer.isExpired(gameTimeNow)) {
            
            this.createProjectile(ProjectileType.Bullet);
            this.nextBulletTimer.startTimer(gameTimeNow);
        }   
    }  

    tryFirePrimaryWeaponWithGamepad() { //x, y) {

        this.tryFirePrimaryWeapon();

        /*
        if(this.deadUntilRespawnTimer.isActive() || this.frozenTimer.isActive() ) return;

        var gameTimeNow = this.scene.game.loop.time;
        if(this.nextRocketTimer.isExpired(gameTimeNow)) {
            
            this.createProjectile(ProjectileType.FireRocket);
            this.nextRocketTimer.startTimer(gameTimeNow);
        } 
        */       
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

        --this.selectedWeaponInventoryItemIndex;
        if(this.selectedWeaponInventoryItemIndex < 0)
            this.selectedWeaponInventoryItemIndex = this.weaponInventoryItems.length - 1;
        
            this.selectedWeaponInventoryItem = this.weaponInventoryItems[this.selectedWeaponInventoryItemIndex];

        var selectedWeaponType = this.selectedWeaponInventoryItem.pickupType;
        this.scene.events.emit('previousWeaponSelected', this.playerId, selectedWeaponType);
    }
    
    trySelectNextWeapon() {

        ++this.selectedWeaponInventoryItemIndex;
        if(this.selectedWeaponInventoryItemIndex > this.weaponInventoryItems.length - 1)
            this.selectedWeaponInventoryItemIndex = 0;

        this.selectedWeaponInventoryItem = this.weaponInventoryItems[this.selectedWeaponInventoryItemIndex];

        var selectedWeaponType = this.selectedWeaponInventoryItem.pickupType;
        this.scene.events.emit('nextWeaponSelected', this.playerId, selectedWeaponType);
    }   
    
    private createLightning(otherPlayerId: uuidv4): Phaser.GameObjects.Sprite {
        let sprite = this.scene.add.sprite(this.x, this.y, 'lightning');// params.key, params.frame);
        sprite.anims.play('lightning', true);
        sprite.setPosition(this.x, this.y);
        sprite.setOrigin(0.5, 0);
        sprite.setScale(1.0, 1.0);
        sprite.setDepth(this.depth);
        sprite.setData('otherPlayerId', otherPlayerId);
        //sprite.setVisible(false);
        
        this.lightningSprites.push(sprite);
        return sprite;
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
            case ProjectileType.Freeze:
                bulletVelocity = 400;
                weaponImageKey = "freezeRocket";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
            case ProjectileType.Rocks:
                bulletVelocity = 500;
                weaponImageKey = "rock";
                scaleX = 0.5;
                scaleY = 0.5;
                break;
        }            

        velocityX = this.aimX * bulletVelocity;
        velocityY = this.aimY * bulletVelocity;
        
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

            this.particleEmitterMuzzleFlash.setPosition(this.x, this.y);
            this.particleEmitterMuzzleFlash.setDepth(this.y + launchPoint.y * bulletLaunchDistanceFromPlayerCenter);            
            this.particleEmitterMuzzleFlash.explode(1, launchPoint.x * bulletLaunchDistanceFromPlayerCenter, launchPoint.y * bulletLaunchDistanceFromPlayerCenter);               
        }
        if(projectileType == ProjectileType.Rocks) {
            switch(this.lastRockLaunchPointOffset) {
                case RockLaunchOffset.Left:
                    launchPoint = this.rockLaunchPointOffsetRight;
                    this.lastRockLaunchPointOffset = RockLaunchOffset.Center;
                    break;
                case RockLaunchOffset.Center:
                    launchPoint = this.rockLaunchPointOffsetCenter;  
                    this.lastRockLaunchPointOffset = RockLaunchOffset.Right;                                      
                    break;                
                case RockLaunchOffset.Right:
                    launchPoint = this.rockLaunchPointOffsetLeft;
                    this.lastRockLaunchPointOffset = RockLaunchOffset.Left;
                    break;
            }            
        }

        var projectile = this.projectileFactory.generateProjectile(
            this.scene,
            projectileType,
            this.x + launchPoint.x * bulletLaunchDistanceFromPlayerCenter,
            this.y + launchPoint.y * bulletLaunchDistanceFromPlayerCenter,
            this.MapPosition.x,
            this.MapPosition.y,
            weaponImageKey,
            1,//this.currentWeaponDamage,
            velocityX,
            velocityY,
            scaleX,
            scaleY,
            -drawAngle
        );

        projectile.init();

        this.bullets.add(projectile);

        return projectile;
    }
}

export { PlayerDrawOrientation };
