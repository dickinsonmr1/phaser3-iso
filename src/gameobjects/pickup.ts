import 'phaser';

export enum PickupType {
    Turbo,
    Health,
    Rocket,
    Bullet,
    Special,
    Flamethrower,
    Shield,
    Airstrike,
    Shockwave,
    Freeze,
    Lightning
}

export class Pickup {

    public PickupType: PickupType;
    public isoBox: Phaser.GameObjects.IsoBox;
    public icon: Phaser.GameObjects.Image;

    constructor(params) {     
        this.isoBox = params.scene.add.isobox(
            params.x, params.y,
            25, 12,
            params.topColor, params.leftColor, params.rightColor);
        
        this.PickupType = params.pickupType;
        this.isoBox.alpha = 0.5;
        this.isoBox.setOrigin(0.5, 0.5);
        this.isoBox.depth = 2;
        this.isoBox.setData('parentId', this);
        this.isoBox.setData('PickupType', params.pickupType);
       
        params.scene.physics.world.enable(this.isoBox);
        params.scene.pickupPhysicsObjects.add(this.isoBox);

        this.icon = params.scene.add.image(
            params.x,
            params.y,
            params.pickupIconKey);

            this.icon.setScale(0.33);
            this.icon.setOrigin(0.5, 0.85);
            this.icon.alpha = 1.0;  
            this.icon.depth = 1;
    }

    update(scale: number) {

        if(this.isoBox.active)
        { 
            this.isoBox.setScale(scale);
            this.icon.setScale(scale * 0.25);
        }
        else {
            this.icon.destroy();            
        }
    }
}