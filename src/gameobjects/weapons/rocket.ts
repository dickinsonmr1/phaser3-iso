import { Constants } from "../../constants";
import { Projectile } from "./projectile";
import { ProjectileType } from "./projectileType";

export class Rocket extends Projectile {
    constructor(params) {
        super(params);
        
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

    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);
        if(this.initiated && this.scene != null && this.scene.sys != null) {  

            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
            }

            this.spotlight.setPosition(this.x, this.y);
            this.particleEmitter.setDepth(4)
            
            this.particleEmitter.emitParticleAt(this.x, this.y);
            
        }
    }

    detonate() {
    }

    override remove() {
        if(this.scene != null && this.spotlight != null)
            this.scene.lights.removeLight(this.spotlight);

        this.particleEmitter.stop();

        this.destroy();
    }
}