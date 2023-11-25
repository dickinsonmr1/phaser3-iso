import { Utility } from "../../utility";
import { GameTimeDelayTimer } from "../gameTimeDelayTimer";
import { Projectile } from "./projectile";

export class SmokeGrenade extends Projectile {

    private particleEmitterSmokeGrenade: Phaser.GameObjects.Particles.ParticleEmitter;
    private timer: GameTimeDelayTimer;

    constructor(params) {
        super(params);
        
        var randSpeedX = Utility.getRandomInt(100) - 50;
        var randSpeedY = Utility.getRandomInt(100) - 50;
        
        this.velocityX = this.velocityX + randSpeedX;
        this.velocityY = this.velocityY + randSpeedY;

        //var randScale = Utility.getRandomInt(3) * 0.1;

        //this.scale = this.scale - randScale;

        var randRotation = Utility.getRandomInt(Math.PI * 2 * 100) / 100;

        //this.setRotation(randRotation);

        this.particleEmitterSmokeGrenade = this.scene.add.particles(0, 0, 'blackSmoke', {
            //color: [ 0x222222, 0x333333, 0x444444 ],
            //colorEase: 'quart.out',
            lifespan: 3000,
            angle: { min: -180, max: -0 },
            scale: { start: 0.3, end: 2, ease: 'sine.out' },
            alpha: { start: 0.9, end: 0 },
            speed: { min: 20, max: 50 },
            advance: 0,
            //blendMode: 'ADD',
            emitting: true
        });

        this.timer = new GameTimeDelayTimer(5000);
    }
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);

        //if(this.timer.isExpired)
            //this.remove();

        if(this.initiated && this.scene != null && this.scene.sys != null) {                          
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                this.velocityX *= 0.98;
                this.velocityY *= 0.98;
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);            
            }

            this.particleEmitterSmokeGrenade.setDepth(this.y + 64);

            let randX = Utility.getRandomInt(10) - 5;
            let randY = Utility.getRandomInt(10) - 5;
            this.particleEmitterSmokeGrenade.emitParticleAt(this.x + randX, this.y + randY);                             
        }
    }

    detonate(){

    }
    //override remove() {
    //}
}