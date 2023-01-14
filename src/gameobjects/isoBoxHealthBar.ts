import { Constants } from "../constants";
import { HudScene } from "../scenes/hudscene";

export enum IsoHudBarType {
    Health,
    Shield,
    Turbo
}
export class IsoBoxHealthBar extends Phaser.GameObjects.Group {

    private topColor: number;
    private leftColor: number;
    private rightColor: number
    
    private isoBox: Phaser.GameObjects.IsoBox;
    private isoBoxOutline: Phaser.GameObjects.IsoBox;

    private currentValue: number;
    public valueMax: number;
    public valueMaxHeightInPixels: number;

    init(hudScene: HudScene, originX: number, originY: number, healthMaxValue: number,
        boxSize: number, boxHeightMaxInPixels: number, 
        isohudBarType: IsoHudBarType): void {

        this.scene = hudScene;

        this.currentValue = healthMaxValue;
        this.valueMax = healthMaxValue;

        this.valueMaxHeightInPixels = boxHeightMaxInPixels;

        var rotation = 0;

        this.isoBoxOutline = this.scene.add.isobox(originX, originY, boxSize, boxHeightMaxInPixels);//, params.topColor, params.leftColor, params.rightColor);
        this.isoBoxOutline.alpha = 0.1;    
        this.isoBoxOutline.depth = 0;
        this.isoBoxOutline.setOrigin(0.5, 1);
        this.isoBoxOutline.rotation = rotation;
        //this.isoBoxOutline.showTop = false;

        let topColor = 0;
        let leftColor = 0;
        let rightColor = 0;
        let alpha = 1;

        switch(isohudBarType){
            case IsoHudBarType.Health:
                topColor = 0xFF726F;
                leftColor = 0xFF302D;
                rightColor = 0xFF5D5B;
                alpha = 0.9;
                break;
            case IsoHudBarType.Shield:
                topColor = 0x6F84FF;
                leftColor = 0x2D4DFF;
                rightColor = 0x5B74FF;
                alpha = 0.5;
                break;
            case IsoHudBarType.Turbo:
                topColor = 0xFFEA6F;
                leftColor = 0xFFEA6F;
                rightColor = 0xFFE65B;
                alpha = 0.9;
                break;
        }

        this.isoBox = this.scene.add.isobox(originX, originY, boxSize - 10, boxHeightMaxInPixels, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        this.isoBox.alpha = alpha;    
        this.isoBox.rotation = rotation;
        //this.isoBox.showTop = false;
        this.isoBox.depth = 2;       
    }

    calculateCurrentHealthBarHeightInPixels(): number {
        return (this.currentValue / this.valueMax) * this.valueMaxHeightInPixels;
    }

    updateValue(currentValue: number) {
        this.currentValue = currentValue;

        this.isoBox.height = this.calculateCurrentHealthBarHeightInPixels();

        if(this.currentValue <= 0) {
            this.isoBox.setVisible(false);
        }
        else {
            if(!this.isoBox.visible)
                this.isoBox.setVisible(true);
        }
    }
}