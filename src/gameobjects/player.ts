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
}

export enum VehicleType {
    Police,
    TrashMan,
    Taxi,
    Ambulance
}

export class Player extends Phaser.GameObjects.Sprite {
    getPlayerSpeed() {
        if(this.turboOn) {
            return 5;
        }
        else 
            return 3;
    }
    private health: number = Player.maxHealth;
    private turbo: number = Player.maxTurbo;

    private get healthBarOffsetX(): number {return -30;}
    private get healthBarOffsetY(): number {return -40;}

    public static get maxHealth(): number { return 20; }
    public static get maxShield(): number { return 4; }
    public static get maxTurbo(): number { return 100; }

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

    public playerId: string;

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

    constructor(params) {
        super(params.scene, params.mapX, params.mapY, params.key, params.frame);

        var utilities = new Utility();
        //this.ScreenLocation = utilities.MapToScreen(params.mapX, params.mapY);
        //super(params.scene,  this.ScreenLocation.x, this.ScreenLocation.y, params.key, params.frame);

        //let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        this.MapPosition = new Phaser.Geom.Point(params.mapX, params.mapY); 
        this.playerPositionOnTileset = new Phaser.Geom.Point(0,0);

        this.playerId = params.playerId;

        this.vehicleType = params.vehicleType;
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
        if(gameScene.showDebug) {

            this.debugCoordinatesText = text;
            this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
            this.debugCoordinatesText.setOrigin(0, 0.5);
            this.debugCoordinatesText.setFontSize(16);
            this.debugCoordinatesText.setVisible(true);//this.isMultiplayer);
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
                    \nIso(${(this.x).toFixed(2)}, ${(this.y).toFixed(2)})
                    \nVelocity(${(this.body.velocity.x).toFixed(2)}, ${(this.body.velocity.y).toFixed(2)})
                    \n@ Tile(${(this.playerPositionOnTileset.x).toFixed(2)}, ${(this.playerPositionOnTileset.y).toFixed(2)})    
                    \n atan ${(this.arctangent / Math.PI).toFixed(2)} PI`)

        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0.5);
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
        let angle = this.arctangent;
        let angle2 = this.arctangent % (Math.PI / 4);

        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI
        if(angle >= 7 * Math.PI / 8 || angle < - 7 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.N;
        }
        else if(angle >= 5 * Math.PI / 8 && angle < 7 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.NE;
        }
        else if(angle >= 3 * Math.PI / 8 && angle < 5 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.E;
        }
        else if(angle >= Math.PI / 8 && angle < 3 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.SE;
        }
        else if(angle >= -Math.PI / 8 && angle < Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.S;
        }
        else if(angle >= -3 * Math.PI / 8 && angle < -Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.SW;
        }
        else if(angle >= -5 * Math.PI / 8 && angle < -3 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.W;
        }
        else if(angle >= -7 * Math.PI / 8 && angle < -5 * Math.PI / 8) {
            this.playerDrawOrientation = PlayerDrawOrientation.NW;
        }       

        this.calculateAimDirection(this.playerDrawOrientation);
    }

    calculateAimDirection(playerDrawOrientation: PlayerDrawOrientation): void{        
        switch(playerDrawOrientation) {
            case PlayerDrawOrientation.N:
                this.aimX = -Math.cos(Math.PI / 4);
                this.aimY = -Math.sin(Math.PI / 4);                        
                break;
            case PlayerDrawOrientation.S:                
                this.aimX = -Math.cos(5 * Math.PI / 4);
                this.aimY = -Math.sin(5 * Math.PI / 4);                
                break;
            case PlayerDrawOrientation.E:
                this.aimX = -Math.cos(3 * Math.PI / 4);
                this.aimY = -Math.sin(3 * Math.PI / 4);                                      
                break;
            case PlayerDrawOrientation.W:
                this.aimX = -Math.cos(7 * Math.PI / 4);
                this.aimY = -Math.sin(7 * Math.PI / 4);                           
                break;
            case PlayerDrawOrientation.NE:
                this.aimX = 0;
                this.aimY = -1;                           
                break;
            case PlayerDrawOrientation.SE:                    
                this.aimX = 1;
                this.aimY = 0;                
                break;
            case PlayerDrawOrientation.NW:
                this.aimX = -1;
                this.aimY = 0;                
                break;
            case PlayerDrawOrientation.SW:    
                this.aimX = 0;
                this.aimY = 1;
                break;
        }
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

        switch(this.playerDrawOrientation) {
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

    tryStopMove(): void {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    tryDamage(): void {
        this.health--;
        this.healthBar.updateHealth(this.health);

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
            
            this.createProjectile(null, null, ProjectileType.Bullet);//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }  

    
    tryFirePrimaryWeapon() {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.rocketTime) {
            
            this.createProjectile(null, null, ProjectileType.Rocket);//this.playerOrientation);
            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    tryTurboBoostOn(): void {
        
        if(this.turbo > 0) {
            this.turboOn = true;
                
            this.turbo--;
            this.turboBar.updateHealth(this.turbo);
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
            
            this.createProjectile(this.aimX, this.aimY, ProjectileType.Rocket);//this.playerOrientation);
            this.rocketTime = gameTime + this.rocketTimeInterval;
        }
    }  

    refillTurbo() {
        this.turbo = Player.maxTurbo;
        this.turboBar.updateHealth(this.turbo);
    }

    refillHealth() {
        this.health = Player.maxHealth;
        this.healthBar.updateHealth(this.health);
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
            case ProjectileType.Rocket:
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

        if(x == null && y == null) {
            var cartesianOrientation = this.getPlayerIsometricOrientation();

            switch(cartesianOrientation){
                case PlayerCartesianOrientation.N:
                    velocityX = 0;
                    velocityY = -bulletVelocity;
                    break;
                case PlayerCartesianOrientation.E:
                    velocityX = bulletVelocity;
                    velocityY = 0;
                    break;
                case PlayerCartesianOrientation.S:
                    velocityX = 0;
                    velocityY = bulletVelocity;
                    break;
                case PlayerCartesianOrientation.W:
                    velocityX = -bulletVelocity;
                    velocityY = 0;
                    break;
                case PlayerCartesianOrientation.NE:
                    velocityX = bulletVelocity;
                    velocityY = -bulletVelocity;
                    break;
                case PlayerCartesianOrientation.SE:
                    velocityX = bulletVelocity;
                    velocityY = bulletVelocity;
                    break;
                case PlayerCartesianOrientation.NW:
                    velocityX = -bulletVelocity;
                    velocityY = -bulletVelocity;
                    break;
                case PlayerCartesianOrientation.SW:
                    velocityX = -bulletVelocity;
                    velocityY = bulletVelocity;
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

        var angle = 0;
        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI

        /*
        if(this.arctangent < 0)
            angle = Math.abs(this.arctangent) - Math.abs(this.arctangent % (Math.PI / 4));
        else
            angle = -(Math.abs(this.arctangent) - Math.abs(this.arctangent % (Math.PI / 4)));
        */
        
        var angle = 0;
        switch(this.playerDrawOrientation) {
            case PlayerDrawOrientation.N:
                angle = Math.PI;
                break;
            case PlayerDrawOrientation.S:                
                angle = 0;
                break;
            case PlayerDrawOrientation.E:
                angle = Math.PI / 2;
                break;
            case PlayerDrawOrientation.W:
                angle = -Math.PI / 2;
                break;
            case PlayerDrawOrientation.NE:                
                //angle = 3 * Math.PI / 4;  
                angle = 2 * Math.PI / 3;                            
                break;
            case PlayerDrawOrientation.SE:                    
                //angle = 3 * Math.PI / 4;
                angle = Math.PI / 3;               
                break;
            case PlayerDrawOrientation.NW:
                //angle = -3 * Math.PI / 4;
                angle = -2 * Math.PI / 3;               
                break;
            case PlayerDrawOrientation.SW:    
                //angle = -Math.PI / 4;      
                angle = -Math.PI / 3;                  
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
            angle: -angle
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