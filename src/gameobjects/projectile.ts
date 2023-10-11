// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import * as Phaser from 'phaser';
import { Scene } from "phaser";
import { Constants } from '../constants';

export enum ProjectileType {
    HomingRocket,
    FireRocket,
    Bullet,
    Airstrike,
    Freeze    
    // EMP
}

export abstract class Projectile extends Phaser.Physics.Arcade.Sprite {

    public damage: number;
    public velocityX: number;
    public velocityY: number;
    public initiated: boolean = false;

    public MapPosition: Phaser.Geom.Point;

    public spotlight;//: Phaser.GameObjects.Light;

    protected crosshairSprite: Phaser.GameObjects.Sprite;

    protected particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    protected particleEmitterExplosion: Phaser.GameObjects.Particles.ParticleEmitter;

    private creationGameTime: number;

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

        if(this.projectileType == ProjectileType.HomingRocket || this.projectileType == ProjectileType.FireRocket
            || this.projectileType == ProjectileType.Freeze) {
            // https://www.phaser.io/examples/v3/view/game-objects/lights/tilemap-layer

            let particleColors = [];

            var rocketColor = 0xFFFFFF;
            switch(this.projectileType) {
                case ProjectileType.HomingRocket:
                    rocketColor = 0xFF00FF;
                    particleColors = [ rocketColor, 0x96e0da, 0x937ef3 ];
                    break;
                case ProjectileType.FireRocket:
                    rocketColor = 0x808080;
                    particleColors = [ rocketColor, 0x96e0da, 0x937ef3 ];
                    break;
                case ProjectileType.Freeze:
                    rocketColor = 0x6FE4FF;
                    particleColors = [ rocketColor ];
                    break;
            }

            this.spotlight = this.scene.lights
                .addLight(this.x, this.y)
                .setRadius(100)
                .setColor(rocketColor)
                .setIntensity(1.5);        

            /*
            this.particleEmitter =  this.scene.add.particles(0, 0, 'smoke', {
                speed: 10, //{ min: 400, max: 400 },                
                lifespan: 400,
                tint: rocketColor, // gray: 808080                
                angle: { min: -100, max: -80 },
                scale: { start: 0.20, end: 0.1, ease: 'sine.out' },
                blendMode: 'ADD',
                //frequency: 25,
                alpha: {start: 1.0, end: 0.0},
                //maxParticles: 25,    
                emitting: false
            });*/
            

            if(this.projectileType == ProjectileType.FireRocket || this.projectileType == ProjectileType.HomingRocket) {

                this.particleEmitter = this.scene.add.particles(0, 0, 'smoke', {                
                    color: particleColors,
                    //tint: rocketColor, // gray: 808080                
                    colorEase: 'quart.out',
                    lifespan: 1000,
                    angle: { min: -100, max: -80 },
                    scale: { start: 0.10, end: 0.5, ease: 'sine.in' },
                    alpha: {start: 0.8, end: 0.0},
                    speed: { min: 20, max: 50 },
                    advance: 0,
                    blendMode: 'ADD',
                    emitting: false
                });

                this.particleEmitter.setDepth(Constants.depthTurboParticles);
            }
            if(this.projectileType == ProjectileType.Freeze) {
                this.particleEmitter = this.scene.add.particles(0, 0, 'smoke', {                
                    color: particleColors,
                    //tint: rocketColor, // gray: 808080                
                    colorEase: 'quart.out',
                    lifespan: 250,
                    angle: { min: -120, max: -60 },
                    scale: { start: 0.1, end: 0.5, ease: 'sine.in' },
                    alpha: {start: 0.8, end: 0.0},
                    speed: { min: 20, max: 50 },
                    advance: 0,
                    blendMode: 'ADD',
                    emitting: false
                });

                this.particleEmitter.setDepth(Constants.depthTurboParticles);
            }
                /*
                frame: 'white',
                //color: [ 0x96e0da, 0x937ef3 ],
                //color: [ 0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404 ],
                color: [ rocketColor, 0x040404, 0x040404 ],
                colorEase: 'quad.out',
                lifespan: 1500,
                angle: { min: -100, max: -80 },
                scale: { start: 0.10, end: 0.5, ease: 'sine.in' },
                alpha: {start: 0.8, end: 0.0},
                speed: { min: 20, max: 50 },
                advance: 0,
                blendMode: 'ADD'
                */

            
        }

        if(this.projectileType == ProjectileType.Airstrike) {
            this.crosshairSprite = this.scene.add.sprite(this.x, this.y, 'crosshair');
            this.crosshairSprite.setOrigin(0.5, 0.5);
            this.crosshairSprite.setAlpha(0.5);
            this.crosshairSprite.setScale(1, 0.6);   

            this.particleEmitterExplosion = this.scene.add.particles(0,0, 'explosion', {
                lifespan: 1000,
                speed: { min: -50, max: 50 },
                scale: {start: 0.5, end: 1.25},
                blendMode: 'ADD',
                frequency: -1,
                alpha: {start: 0.9, end: 0.0}
            });
        }
        else if(this.projectileType == ProjectileType.Freeze) {
            this.particleEmitterExplosion = this.scene.add.particles(0,0, 'smoke', {
                lifespan: 1000,
                //angle: { min: -100, max: -80 },
                speed: { min: -50, max: 50 },
                scale: {start: 0.5, end: 0.1},
                color: [0x6FE4FF],
                blendMode: 'ADD',
                frequency: -1,
                alpha: {start: 0.9, end: 0.0}
            });
        }
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
            
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
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