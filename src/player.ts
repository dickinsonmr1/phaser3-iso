import 'phaser'
import { Constants } from './constants';
import { HealthBar } from './healthBar';
import { Bullet } from './bullet';
import { Point, Utilities } from './utilities';

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

export class Player extends Phaser.GameObjects.Sprite {
    playerSpeed: number = 3;
    health = 10;

    private get healthBarOffsetX(): number {return -30;}
    private get healthBarOffsetY(): number {return -30;}

    public static get maxHealth(): number { return 4; }
    public static get maxShield(): number { return 4; }

    private get GetTextOffsetY(): number { return -100; }

    healthBar: HealthBar;
    private debugCoordinatesText: Phaser.GameObjects.Text;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetX(): number { return -20; }
    private get GetPlayerNameOffsetY(): number { return -40; }

    

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
    public bulletTimeInterval: number = 200;
    private bulletVelocity: number = 5;

    public MapPosition: Phaser.Geom.Point;
    public playerPositionOnTileset: Phaser.Geom.Point;

    constructor(params) {
        super(params.scene, params.mapX, params.mapY, params.key, params.frame);

        var utilities = new Utilities();
        //this.ScreenLocation = utilities.MapToScreen(params.mapX, params.mapY);
        //super(params.scene,  this.ScreenLocation.x, this.ScreenLocation.y, params.key, params.frame);

        //let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        this.MapPosition = new Phaser.Geom.Point(params.mapX, params.mapY); 
        this.playerPositionOnTileset = new Phaser.Geom.Point(0,0);

        this.playerId = params.playerId;

        this.setDisplayOrigin(0, 100);

        this.scene.add.existing(this);

        this.playerDrawOrientation = PlayerDrawOrientation.W;

        this.healthBar = new HealthBar(this.scene)
        
        this.healthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            this.health, 
            50, 10, false);
        
        this.healthBar.setDepth(Constants.depthHealthBar);
        this.healthBar.show();

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
                font: '24px Courier',
                //fontFamily: 'KenneyRocketSquare',         
                color:"rgb(255,255,255)",
            });
        text.setAlpha(0.5);
        text.setOrigin(0, 0.5);
        text.setDepth(7);
        //playerNameText.setStroke('rgb(0,0,0)', 4);     
        //playerNameText.setFontSize(24); 
        
        this.debugCoordinatesText = text;
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
        this.debugCoordinatesText.setOrigin(0, 0.5);
        this.debugCoordinatesText.setFontSize(16);
        this.debugCoordinatesText.setVisible(true);//this.isMultiplayer);
    }
    init() {
        this.scene.physics.world.enable(this);
    }

    update(...args: any[]): void {

        this.MapPosition.x += this.body.velocity.x;
        this.MapPosition.y += this.body.velocity.y;

        var utility = new Utilities();
        var screenPosition = utility.cartesianToIsometric(this.MapPosition);
        this.playerPositionOnTileset = utility.getTileCoordinates(this.MapPosition, 32);

        this.x = screenPosition.x;
        this.y = screenPosition.y;
        //this.body.position.x = screenPosition.x;
        //this.body.position.y = screenPosition.y;

        this.healthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);
        this.alignDebugText(this.x + this.GetPlayerNameOffsetX, this.y + 2 * this.GetPlayerNameOffsetY);

        this.setOrigin(0.5, 0.5);

        if(this.bulletTime > 0)
            this.bulletTime--;
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
                        \n@ Tile(${(this.playerPositionOnTileset.x).toFixed(2)}, ${(this.playerPositionOnTileset.y).toFixed(2)})`)
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0.5);
    }

    tryMove(direction: PlayerDrawOrientation) {
        this.playerDrawOrientation = direction;

        switch(direction) {
            case PlayerDrawOrientation.N:
                this.body.velocity.x = -Math.cos(Math.PI / 4) * this.playerSpeed;
                this.body.velocity.y = -Math.sin(Math.PI / 4) * this.playerSpeed;                            
                this.anims.play('police-N', true);
                break;
            case PlayerDrawOrientation.S:                
                this.body.velocity.x = -Math.cos(5 * Math.PI / 4) * this.playerSpeed;
                this.body.velocity.y = -Math.sin(5 * Math.PI / 4) * this.playerSpeed; 
                this.anims.play('police-S', true);
                break;
            case PlayerDrawOrientation.E:
                this.body.velocity.x = -Math.cos(3 * Math.PI / 4) * this.playerSpeed;
                this.body.velocity.y = -Math.sin(3 * Math.PI / 4) * this.playerSpeed;                                       
                this.anims.play('police-E', true);
                break;
            case PlayerDrawOrientation.W:
                this.body.velocity.x = -Math.cos(7 * Math.PI / 4) * this.playerSpeed;
                this.body.velocity.y = -Math.sin(7 * Math.PI / 4) * this.playerSpeed;                            
                this.anims.play('police-W', true);
                break;
            case PlayerDrawOrientation.NE:
                this.body.velocity.x = 0;
                this.body.velocity.y = -1 * this.playerSpeed;                              
                this.anims.play('police-NE', true);
                break;
            case PlayerDrawOrientation.SE:                    
                this.body.velocity.x = 1 * this.playerSpeed;
                this.body.velocity.y = 0;                
                this.anims.play('police-SE', true);
                break;
            case PlayerDrawOrientation.NW:
                this.body.velocity.x = -1 * this.playerSpeed;
                this.body.velocity.y = 0;                
                this.anims.play('police-NW', true);   
                break;
            case PlayerDrawOrientation.SW:    
                this.body.velocity.x = 0;
                this.body.velocity.y = 1 * this.playerSpeed;  
                this.anims.play('police-SW', true);                
                break;
        }
    }

    tryFireBullet() {
        var gameTime = this.scene.game.loop.time;

        if(gameTime > this.bulletTime) {
            
            this.createBullet();//this.playerOrientation);
            this.bulletTime = gameTime + this.bulletTimeInterval;
        }
    }

    private createBullet() : Bullet {
        //var body = <Phaser.Physics.Arcade.Body>this.body;
        var velocityX: number;
        var velocityY: number;
        var cartesianOrientation = this.getPlayerIsometricOrientation();

        switch(cartesianOrientation){
            case PlayerCartesianOrientation.N:
                velocityX = 0;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerCartesianOrientation.E:
                velocityX = this.bulletVelocity;
                velocityY = 0;
                break;
            case PlayerCartesianOrientation.S:
                velocityX = 0;
                velocityY = this.bulletVelocity;
                break;
            case PlayerCartesianOrientation.W:
                velocityX = -this.bulletVelocity;
                velocityY = 0;
                break;
            case PlayerCartesianOrientation.NE:
                velocityX = this.bulletVelocity;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerCartesianOrientation.SE:
                velocityX = this.bulletVelocity;
                velocityY = this.bulletVelocity;
                break;
            case PlayerCartesianOrientation.NW:
                velocityX = -this.bulletVelocity;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerCartesianOrientation.SW:
                velocityX = -this.bulletVelocity;
                velocityY = this.bulletVelocity;
                break;
        }

        var velocityX: number;
        /*
        if(this.flipX)
            velocityX = -this.playerBulletVelocityX
        else
            velocityX = this.playerBulletVelocityX;
        */

        var utility = new Utilities();
        var screenPosition = utility.cartesianToIsometric(this.MapPosition);
        
        //this.x = screenPosition.x;
        //this.y = screenPosition.y;

        var bullet = new Bullet({
            scene: this.scene,
            isometricX: screenPosition.x, //body.x + this.playerBulletOffsetX(),
            isometricY: screenPosition.y, //body.y + this.getBulletOffsetY(),
            mapPositionX: this.MapPosition.x,
            mapPositionY: this.MapPosition.y,
            key: "playerGunLaser1",//this.currentWeaponBulletName,
            //flipX: this.flipX,
            damage: 1,//this.currentWeaponDamage,
            velocityX: velocityX,
            velocityY: velocityY
        });
        bullet.init();

        //this.bullets.add(bullet);

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