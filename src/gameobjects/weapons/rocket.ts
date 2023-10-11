import { Projectile } from "../projectile";

export class Rocket extends Projectile {
    constructor(params) {
        super(params);
        
    }
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);

        if(this.initiated && this.scene != null && this.scene.sys != null) {  
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