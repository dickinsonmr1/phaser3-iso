import { Constants } from "../../constants";
import { Projectile } from "./projectile";
import { ProjectileType } from "./projectileType";

export class FlamingSkull extends Projectile {

    public particleEmitterBurn: Phaser.GameObjects.Particles.ParticleEmitter;
    private skullColor: number;
    
    public childrenProjeciles: Phaser.GameObjects.Group = this.scene.physics.add.group();
    //private isActive: boolean = false;

    constructor(params) {
        super(params);
        
        let particleColors = [];

        this.skullColor = 0x33FF33;
        particleColors = [ this.skullColor ];
        
        if(params.countChildren > 0) {

            for(let angle = -Math.PI; angle < Math.PI; angle+=(Math.PI / 4)) {

                let velocityX = Math.cos(angle) * 100;
                let velocityY = Math.sin(angle) * 100;

                var temp = new FlamingSkull({
                    scene: params.scene,
                    projectileType: params.projectileType,
                    isometricX: params.isometricX,
                    isometricY: params.isometricY,
                    mapPositionX: params.mapPositionX,
                    mapPositionY: params.mapPositionY,
                    key: params.weaponImageKey,
                    damage: params.damage,
                    velocityX: velocityX, //params.velocityX,
                    velocityY: velocityY, //params.velocityY,
                    scaleX: params.scaleX / 4,
                    scaleY: params.scaleY / 4,
                    angle: params.angle,
                    countChildren: 0
                }); 
                temp.active = false;
                this.childrenProjeciles.add(temp);
            }        
        }

        if(params.countChildren > 0) {
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

        this.particleEmitterBurn = this.scene.add.particles(this.x, this.y, 'deathIcon',
        {
            //frame: 'white',

            color: [ 0xEBFAF7, 0xE0FCF3, 0xC2FEE9, 0xA3F8E3, 0x91E8D6, 0x78D1C6, 0x54B5AA, 0x409C8F],
            lifespan: 250,
            angle: { min: 0, max: -180 },
            scale: { start: params.scaleY, end: 0.1},
            speed: { min: 50, max: 100 },
            //advance: 2000,
            blendMode: 'ADD',
            //tint: [0x55FF55],
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

        if(params.countChildren > 0) {
            this.particleEmitterBurn.start(0, 2000);
            
            this.spotlight = this.scene.lights
                .addLight(this.x, this.y)
                .setRadius(100)
                .setColor(this.skullColor)
                .setIntensity(0.5);
        }
    }

    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);
        if(this.initiated && this.scene != null && this.scene.sys != null) {  

            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
            }

            if(this.spotlight != null) {
                this.spotlight.setPosition(this.x, this.y);
                if(this.childrenProjeciles.getChildren().length == 0)
                    this.spotlight.setIntensity(this.spotlight.intensity -= 0.01);
            }

            if(this.particleEmitter != null) {
                this.particleEmitter.setDepth(4);
                
                this.particleEmitter.emitParticleAt(this.x, this.y);
            }
            
            this.particleEmitterBurn.setPosition(this.x, this.y);    
            
            this.childrenProjeciles.getChildren().forEach(x => {
                var temp = <FlamingSkull>x;            
                temp.setPosition(this.x, this.y);        
            });
        }
    }

    detonate() {

        this.childrenProjeciles.getChildren().forEach(x => {
            var temp = <FlamingSkull>x;            
            temp.setPosition(this.x, this.y);
            
            /*
            temp.spotlight = this.scene.lights
                .addLight(this.x, this.y)
                .setRadius(100)
                .setColor(this.skullColor)
                .setIntensity(1);
            temp.spotlight.setPosition(this.x, this.y);
            */
            temp.active = true;      

            temp.particleEmitterBurn.start(0, 2000);      
        });
        this.remove();
        //this.destroy();
    }

    override remove() {
        if(this.scene != null && this.spotlight != null)
            this.scene.lights.removeLight(this.spotlight);

        if(this.scene != null && this.particleEmitter != null)
            this.particleEmitter.stop();

        this.destroy();
    }
}