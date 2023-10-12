import { Constants } from "../../constants";
import { Projectile } from "./projectile";

export class FreezeRocket extends Projectile {
    constructor(params) {
        super(params);
        
        let rocketColor = 0x6FE4FF;
        let particleColors = [ rocketColor ];

        this.spotlight = this.scene.lights
            .addLight(this.x, this.y)
            .setRadius(100)
            .setColor(rocketColor)
            .setIntensity(1.5);        
            
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
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);
        if(this.initiated && this.scene != null && this.scene.sys != null) {  

            this.spotlight.setPosition(this.x, this.y);
            this.particleEmitter.setDepth(4)
            
            this.particleEmitter.emitParticleAt(this.x, this.y);
        }
    }

    override detonate() {
        this.particleEmitterExplosion.setDepth(this.y + 64);
        this.particleEmitterExplosion.emitParticleAt(this.x, this.y, 10);
        this.remove();
    }

    override remove() {
        if(this.scene != null && this.spotlight != null)
            this.scene.lights.removeLight(this.spotlight);

        this.particleEmitter.stop();

        this.destroy();
    }
}