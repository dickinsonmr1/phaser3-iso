import { Projectile } from "./projectile";

export class Airstrike extends Projectile {
    constructor(params) {
        super(params);
        
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
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);

        if(this.initiated && this.scene != null && this.scene.sys != null) {  
                        
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
            }

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