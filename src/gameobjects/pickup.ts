import 'phaser';

export enum PickupType {
    Turbo,
    Health,
    Rocket,
    Bullet,
    Special
}

/*
// not being used yet
export class Pickup extends Phaser.GameObjects.IsoBox {

    public PickupType: PickupType;
    public isoBox: Phaser.GameObjects.IsoBox;

    constructor(params) {     
        super(params.scene, params.x, params.y, params.size, params.height, params.topColor, params.leftColor, params.rightColor);        
        this.isoBox = params.scene.add.isobox(params.x, params.y, 20, 10, params.topColor, params.leftColor, params.rightColor);
        
        //this.isoBox = params.scene.add.isob
        this.PickupType = params.pickupType;
        this.isoBox.alpha = 0.7;
        this.isoBox.setOrigin(0.5, 0.5);
        this.isoBox.depth = 10;
       
        params.scene.physics.world.enable(this.isoBox);
        //this.setVisible(true);
                        
                //var text = this.add.text(temp.x, temp.y, `Rockets (${temp.x}, ${temp.y})`, {                
                //    font: 'bold 12px Arial'
                //});
                //text.depth = 10;

    }

    update(...args: any[]): void {

    }

    //setScale(scale: number) {
        //this.isoBox.setScale(scale);
    //}
}
*/