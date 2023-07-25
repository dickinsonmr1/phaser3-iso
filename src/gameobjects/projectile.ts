// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import * as Phaser from 'phaser';
import { Scene } from "phaser";
import { Utility } from "../utility";
import { Constants } from '../constants';
/*
import { Constants } from "../client/constants";
import { MainScene } from "../client/scenes/mainScene";
import { Socket } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';
*/

export enum ProjectileType {
    HomingRocket,
    FireRocket,
    Bullet,
    Airstrike
    // Freeze
    // EMP
}

export class Projectile extends Phaser.Physics.Arcade.Sprite {

    public damage: number;
    public velocityX: number;
    public velocityY: number;
    //public bulletId: uuidv4;
    public initiated: boolean = false;

    public MapPosition: Phaser.Geom.Point;

    public spotlight;//: Phaser.GameObjects.Light;

    private crosshairSprite: Phaser.GameObjects.Sprite;

    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particleEmitterExplosion: Phaser.GameObjects.Particles.ParticleEmitter;

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
    private detonationCount: integer = 0;
    private readonly maxDetonationCount: integer = 7;


    constructor(params)
    {
        super(params.scene, params.isometricX, params.isometricY, params.key);

        this.projectileType = params.projectileType;

        this.MapPosition = new Phaser.Geom.Point(params.mapPositionX, params.mapPositionY); 
        //this.bulletId = uuidv4();
        this.rotation = params.angle;
        this.setScale(params.scaleX, params.scaleY);   
        
        this.setOrigin(0.5, 0.5);

        this.creationGameTime = this.scene.game.getTime();

        this.scene.add.existing(this);
               
        //this.flipX = params.flipX;
        this.damage = params.damage;       
        this.velocityX = params.velocityX;
        //if(params.velocityY != null)
            this.velocityY = params.velocityY;
        //else   
            //this.velocityY = 0;

        this.scene.physics.world.enable(this);

        this.setCircle(this.getBodyDrawSize(), -this.bodyDrawOffset, -this.bodyDrawOffset)
       
        if(this.projectileType == ProjectileType.Airstrike)
            this.setAlpha(0.2);
        else
            this.setAlpha(1.0);
        this.setDepth(this.y);//Constants.depthBullets);

        if(this.projectileType == ProjectileType.HomingRocket || this.projectileType == ProjectileType.FireRocket) {
            // https://www.phaser.io/examples/v3/view/game-objects/lights/tilemap-layer

            var rocketColor = 0xFFFFFF;
            switch(this.projectileType) {
                case ProjectileType.HomingRocket:
                    rocketColor = 0xFF00FF;
                    break;
                case ProjectileType.FireRocket:
                    rocketColor = 0x808080;
                    break;
            }

            this.spotlight = this.scene.lights
                .addLight(this.x, this.y)
                .setRadius(100)
                .setColor(rocketColor)
                .setIntensity(1.5);        

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
                /*
                color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
                colorEase: 'quad.out',
                lifespan: 400,
                //angle: { min: -280, max: -260 },
                angle: { min: -100, max: -80 },
                scale: { start: 0.20, end: 0, ease: 'sine.out' },
                speed: 100,
                //advance: 2000,
                blendMode: 'ADD',
                emitting: false
                */
            });
            this.particleEmitter.setDepth(Constants.depthTurboParticles)
        }

        if(this.projectileType == ProjectileType.Airstrike) {
            this.crosshairSprite = this.scene.add.sprite(this.x, this.y, 'crosshair');
            this.crosshairSprite.setOrigin(0.5, 0.5);
            this.crosshairSprite.setAlpha(0.5);
            //this.crosshairSprite.setAngle(45);
            this.crosshairSprite.setScale(1, 0.6);   

            this.particleEmitterExplosion = this.scene.add.particles(0,0, 'explosion', {
                lifespan: 1000,
                speed: { min: -50, max: 50 },
                //tint: 0xff0000, 
                scale: {start: 0.5, end: 1.25},
                blendMode: 'ADD',
                frequency: -1,
                alpha: {start: 0.9, end: 0.0}
            });
        }

        // https://www.phaser.io/examples/v3/view/game-objects/lights/create-point-light
        // this.spotlight = this.scene.add.pointlight(this.x, this.y, 0, 20, 1);
            //.setRadius(100)
            //.setColor(0xff0000)
            //.setIntensity(1);
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

            //if(this.scene.sys.game.loop.time > this.markedForRemovalGameTime) {
                //this.remove();
            //}
            
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
            }
            
                        
            //this.MapPosition.x += this.velocityX;
            //this.MapPosition.y += this.velocityY;
            
            //var isoPosition = Utility.cartesianToIsometric(this.MapPosition);
            //this.x = isoPosition.x;
            //this.y = isoPosition.y;

            if(this.projectileType == ProjectileType.HomingRocket || this.projectileType == ProjectileType.FireRocket) {
                this.spotlight.setPosition(this.x, this.y);
                this.particleEmitter.setDepth(4)
                
                this.particleEmitter.emitParticleAt(this.x, this.y);
                //this.particleEmitter.setPosition(this.x, this.y);
            }

            if(this.projectileType == ProjectileType.Airstrike) {

                this.crosshairSprite.setPosition(this.x, this.y);

                if(this.scene != null && this.scene.sys != null) {
                    if(this.scene.sys.game.loop.time > this.detonationGameTime) {
                        this.detonate();
                    }
                }               
            }


            
            /*
            var body = <Phaser.Physics.Arcade.Body>this.body;
            body.position.x = this.MapPosition.x; //isoPosition.x;
            body.position.y = this.MapPosition.y; //isoPosition.y;
            */
        }
        /*
        console.log('bulletMovement');

        var socket = this.getSocket();        
        if(socket != null) {
            // sends back to server
            socket.emit('bulletMovement', {bulletId: this.bulletId, x: this.x, y: this.y, velocityX: this.velocityX});                
        }
        */
    }

    update(...args: any[]): void {
        this.setDepth(this.y);

    }

    detonate() {
        if(this.projectileType == ProjectileType.Airstrike) {
            
            this.detonated = true;
            //var body = <Phaser.Physics.Arcade.Body>this.body;
            //body.setVelocityX(0);
            //body.setVelocityY(0);

            //this.particleEmitterExplosion.setPosition(this.x, this.y);
            //this.particleEmitterExplosion.setDepth(this.y + 64);
            //this.particleEmitterExplosion.emitParticle(10);    

            this.particleEmitterExplosion.setDepth(this.y + 64);
            this.particleEmitterExplosion.emitParticleAt(this.x, this.y, 10);

            this.detonationCount++;

            if(this.scene != null && this.scene.sys != null) 
            {
                this.detonationGameTime = this.scene.sys.game.loop.time + 50;
            }
            else
                this.remove();

            if(this.detonationCount > this.maxDetonationCount)
                this.remove();
        } 
    }

    remove() {
        if(this.projectileType == ProjectileType.HomingRocket || this.projectileType == ProjectileType.FireRocket) {
            if(this.scene != null && this.spotlight != null)
                this.scene.lights.removeLight(this.spotlight);

            this.particleEmitter.stop();
        }
        if(this.projectileType == ProjectileType.Airstrike) {
            this.crosshairSprite.destroy();

            //this.particleEmitterExplosion.setPosition(this.x, this.y);
            //this.particleEmitterExplosion.setDepth(this.y + 64);
            //this.particleEmitterExplosion.emitParticle(10, this.x, this.y);  
        }
        this.destroy();
    }
    /*
    getSocket(): Socket {
        let scene = <MainScene>this.scene;            
        return scene.sceneController.socketClient.socket;
    }*/
}

