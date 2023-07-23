import 'phaser';

export enum PickupType {
    Turbo,
    Health,
    Rocket,
    Bullet,
    Special,
    Flamethrower,
    Shield,
    Airstrike
}


// not being used yet
export class Pickup { //extends Phaser.GameObjects.IsoBox {

    public PickupType: PickupType;
    public isoBox: Phaser.GameObjects.IsoBox;
    public icon: Phaser.GameObjects.Image;

    constructor(params) {     
        //super(params.scene, params.x, params.y, params.size, params.height, params.topColor, params.leftColor, params.rightColor);        
        this.isoBox = params.scene.add.isobox(
            params.x, params.y,
            25, 12,
            params.topColor, params.leftColor, params.rightColor);
        
        //this.isoBox = params.scene.add.isob
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
            //this.deathIcon.setDisplayOrigin(0,0);
            this.icon.alpha = 1.0;//0.2;    
            this.icon.depth = 1;

        //this.setVisible(true);
                        
                //var text = this.add.text(temp.x, temp.y, `Rockets (${temp.x}, ${temp.y})`, {                
                //    font: 'bold 12px Arial'
                //});
                //text.depth = 10;

    }

    update(scale: number) {//...args: any[]): void {

        if(this.isoBox.active)
        { 
            this.isoBox.setScale(scale);
            this.icon.setScale(scale * 0.25);
        }
        else {
            this.icon.destroy();            
        }
    }

    //setScale(scale: number) {
        //this.isoBox.setScale(scale);
    //}
}
