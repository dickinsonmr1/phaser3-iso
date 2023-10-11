import { Projectile } from "../projectile";

export class Airstrike extends Projectile {
    constructor(params) {
        super(params);
        
    }
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);

        if(this.initiated && this.scene != null && this.scene.sys != null) {  
            this.crosshairSprite.setPosition(this.x, this.y);

            if(this.scene != null && this.scene.sys != null) {
                if(this.scene.sys.game.loop.time > this.detonationGameTime) {
                    this.detonate();
                }
            }   
        }    
    }
    
    override detonate() {
        this.detonated = true;

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

    override remove() {
        if(this.scene != null && this.spotlight != null)
            this.scene.lights.removeLight(this.spotlight);

        this.crosshairSprite.destroy();

        this.destroy();
    }
}