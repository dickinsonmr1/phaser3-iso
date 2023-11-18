// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import * as Phaser from 'phaser';
import { Scene } from "phaser";
import { ProjectileType } from './projectileType';

export abstract class Projectile extends Phaser.Physics.Arcade.Sprite {

    public damage: number;
    public velocityX: number;
    public velocityY: number;
    public initiated: boolean = false;

    public MapPosition: Phaser.Geom.Point;

    public spotlight: Phaser.GameObjects.Light;

    protected crosshairSprite: Phaser.GameObjects.Sprite;

    protected particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    protected particleEmitterExplosion: Phaser.GameObjects.Particles.ParticleEmitter;

    protected creationGameTime: number;

    public projectileType: ProjectileType;

    private getBodyDrawSize(): number {
        if(this.projectileType == ProjectileType.Bullet)
            return 15;
        else return 24;
    }
    private bodyDrawOffset: number = 0;

    public detonationGameTime: number;
    public detonated: boolean = false;
    protected detonationCount: integer = 0;
    protected readonly maxDetonationCount: integer = 7;


    constructor(params)
    {
        super(params.scene, params.isometricX, params.isometricY, params.key);

        this.projectileType = params.projectileType;

        this.MapPosition = new Phaser.Geom.Point(params.mapPositionX, params.mapPositionY); 
        this.rotation = params.angle;
        this.setScale(params.scaleX, params.scaleY);   
        
        this.setOrigin(0.5, 0.5);

        this.creationGameTime = this.scene.game.getTime();

        this.scene.add.existing(this);
                       
        this.damage = params.damage;       
        this.velocityX = params.velocityX;
        this.velocityY = params.velocityY;

        this.scene.physics.world.enable(this);

        this.setCircle(this.getBodyDrawSize(), -this.bodyDrawOffset, -this.bodyDrawOffset)
       
        if(this.projectileType == ProjectileType.Airstrike)
            this.setAlpha(0.2);
        else
            this.setAlpha(1.0);
        this.setDepth(this.y);      
    }

    public getScene(): Scene {
        return this.scene;
    }

    public init() {       
        this.initiated = true;
    }

    preUpdate(time, delta): void {  

        if(this.initiated && this.scene != null && this.scene.sys != null) {  
            super.preUpdate(time, delta);

            if(this.scene.sys.game.loop.time > this.creationGameTime + 3000) {
                this.remove();
            }
        }
    }

    update(...args: any[]): void {
        this.setDepth(this.y);
    }

    abstract detonate();

    remove() {
        this.destroy();
    }
}