import { Projectile } from "./projectile";

export class Bullet extends Projectile {
    constructor(params) {
        super(params);
        
    }
    
    //preUpdate(time: any, delta: any): void {        
    //}
    detonate(){

    }

    override remove() {
    }
}