import { Projectile } from "./projectile";

export class Bullet extends Projectile {
    constructor(params) {
        super(params);
        
    }
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);
        if(this.initiated && this.scene != null && this.scene.sys != null) {  
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);
            }

        }
    }

    detonate(){

    }

    override remove() {
    }
}