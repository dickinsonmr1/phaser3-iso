import { Utility } from "../../utility";
import { Projectile } from "./projectile";

export class Rocks extends Projectile {
    constructor(params) {
        super(params);
        
        var randSpeedX = Utility.getRandomInt(100) - 50;
        var randSpeedY = Utility.getRandomInt(100) - 50;
        
        this.velocityX = this.velocityX + randSpeedX;
        this.velocityY = this.velocityY + randSpeedY;

        var randScale = Utility.getRandomInt(3) * 0.1;

        this.scale = this.scale - randScale;

        var randRotation = Utility.getRandomInt(Math.PI * 2 * 100) / 100;

        this.setRotation(randRotation);
    }
    
    override preUpdate(time: any, delta: any): void {        
        super.preUpdate(time, delta);

        if(this.initiated && this.scene != null && this.scene.sys != null) {                          
            var body = <Phaser.Physics.Arcade.Body>this.body;
            if(body != null && this.velocityX != null && this.velocityY != null) { // && this.markedForRemovalGameTime == 0) {
                this.velocityX *= 0.98;
                this.velocityY *= 0.98;
                body.setVelocityX(this.velocityX);
                body.setVelocityY(this.velocityY);            
            }
        }
    }

    detonate(){

    }
    //override remove() {
    //}
}