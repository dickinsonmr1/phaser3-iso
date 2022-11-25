import 'phaser'
import { Constants } from './constants';
import { HealthBar } from './healthBar';
import { Bullet } from './bullet';
import { Point, Utilities } from './utilities';

export enum PlayerOrientation {
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
    playerSpeed: number = 100;
    health = 10;

    private get healthBarOffsetX(): number {return -30;}
    private get healthBarOffsetY(): number {return -30;}

    public static get maxHealth(): number { return 4; }
    public static get maxShield(): number { return 4; }

    private get GetTextOffsetY(): number { return -100; }

    healthBar: HealthBar;
    private multiplayerNameText: Phaser.GameObjects.Text;
    private get GetPlayerNameOffsetX(): number { return -20; }
    private get GetPlayerNameOffsetY(): number { return -40; }

    public playerId: string;

    playerOrientation: PlayerOrientation;

    public bullets: Phaser.GameObjects.Group;
    public lastUsedBulletIndex: number;
    public bulletTime: number = 0;
    public bulletTimeInterval: number = 200;
    private bulletVelocity: number = 3;

    public MapPosition: Phaser.Geom.Point;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        //var utilities = new Utilities();
        //this.ScreenLocation = utilities.MapToScreen(params.mapX, params.mapY);
        //super(params.scene,  this.ScreenLocation.x, this.ScreenLocation.y, params.key, params.frame);

        //let isoPt = new Phaser.Geom.Point();//It is not advisable to create points in update loop
        this.MapPosition = new Phaser.Geom.Point(0, 0); 

        this.playerId = params.playerId;

        this.scene.add.existing(this);

        this.playerOrientation = PlayerOrientation.W;

        this.healthBar = new HealthBar(this.scene)
        
        this.healthBar.init(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY,
            this.health, 
            50, 10, false);
        
        this.healthBar.setDepth(Constants.depthHealthBar);
        this.healthBar.show();

        // multiplayer player name text
        var playerNameText = this.scene.add.text(this.x, this.y - this.GetTextOffsetY, this.playerId,
            {
                font: '16px Courier',
                //fontFamily: 'KenneyRocketSquare',         
                color:"rgb(255,255,255)",
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
    }

    update(...args: any[]): void {

        var utility = new Utilities();
        var screenPosition = utility.cartesianToIsometric(this.MapPosition);

        this.x = screenPosition.x;
        this.y = screenPosition.y;
        this.healthBar.updatePosition(this.x + this.healthBarOffsetX, this.y + this.healthBarOffsetY);
        this.alignPlayerNameText(this.x + this.GetPlayerNameOffsetX, this.y + this.GetPlayerNameOffsetY);

        if(this.bulletTime > 0)
            this.bulletTime--;
    }

    alignPlayerNameText(x: number, y: number) {
        var text = this.multiplayerNameText;
        text.setX(x);
        text.setY(y);// + this.GetTextOffsetY);
        text.setOrigin(0, 0.5);
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
        switch(this.playerOrientation){
            case PlayerOrientation.N:
                velocityX = 0;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerOrientation.E:
                velocityX = this.bulletVelocity;
                velocityY = 0;
                break;
            case PlayerOrientation.S:
                velocityX = 0;
                velocityY = this.bulletVelocity;
                break;
            case PlayerOrientation.W:
                velocityX = -this.bulletVelocity;
                velocityY = 0;
                break;
            case PlayerOrientation.NE:
                velocityX = this.bulletVelocity;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerOrientation.SE:
                velocityX = this.bulletVelocity;
                velocityY = this.bulletVelocity;
                break;
            case PlayerOrientation.NW:
                velocityX = -this.bulletVelocity;
                velocityY = -this.bulletVelocity;
                break;
            case PlayerOrientation.SW:
                velocityX = -1;
                velocityY = 1;
                break;
        }

        var velocityX: number;
        /*
        if(this.flipX)
            velocityX = -this.playerBulletVelocityX
        else
            velocityX = this.playerBulletVelocityX;
        */

        var bullet = new Bullet({
            scene: this.scene,
            x: this.x, //body.x + this.playerBulletOffsetX(),
            y: this.y, //body.y + this.getBulletOffsetY(),
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