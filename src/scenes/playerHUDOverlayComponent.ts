
import { HealthBar } from "../gameobjects/healthBar";
import { HudScene } from "./hudscene";

export class PlayerHUDOverlayComponent {

    scene: HudScene;
    playerName: string;
    hudGroup: Phaser.GameObjects.Group;

    weaponIcon: Phaser.GameObjects.Image;
    ammoText: Phaser.GameObjects.Text;
    playerNameText: Phaser.GameObjects.Text;

    healthBar: HealthBar;
    turboBar: HealthBar;    

    displayX: number;
    displayY: number;

    constructor(scene: HudScene, playerName: string, x: number, y: number) {
        this.scene = scene;
        this.displayX = x;
        this.displayY = y;
        this.playerName = playerName;    

        this.playerNameText = this.scene.add.text(x, y, playerName,
        {
            font: 'bold 26px Arial'
        });
        this.playerNameText.setOrigin(0.5, 0.5);

        let rotation = 0;

        let topColor = 0xB4FF6F;
        let leftColor = 0x93FF2D;
        let rightColor = 0xABFF5B;

        var isoBoxHealthOutline = this.scene.add.isobox(100, 400, 100, 200);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxHealthOutline.alpha = 0.1;    
        isoBoxHealthOutline.rotation = rotation;
        isoBoxHealthOutline.depth = 2;
        isoBoxHealthOutline.setOrigin(0.5, 1);
        //isoBoxHealthOutline.setProjection(90);
        
        var isoBoxHealth = this.scene.add.isobox(100, 400, 90, 150, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxHealth.alpha = 0.7;    
        isoBoxHealth.rotation = rotation;
        isoBoxHealth.depth = 1;
         
         
        var isoBoxTurboOutline = this.scene.add.isobox(210, 400, 100, 200);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxTurboOutline.alpha = 0.1;  
        isoBoxTurboOutline.rotation = rotation;
        isoBoxTurboOutline.depth = 2;    

        topColor = 0xFFEA6F;
        leftColor = 0xFFEA6F;
        rightColor = 0xFFE65B;
        
        var isoBoxTurbo = this.scene.add.isobox(210, 400, 90, 25, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxTurbo.alpha = 0.7;    
        isoBoxTurbo.rotation = rotation;  
        isoBoxTurbo.depth = 1;
        //isoBoxTurbo.rotation = Math.PI / 2;  
        
        var isotriangle = this.scene.add.isotriangle(320, 400, 100, 100, true);//, topColor, leftColor, rightColor);
        //isotriangle.showLeft = false;
        //isotriangle.showRight = false;
        //isotriangle.showTop = true;
    }

    updateLocation(x: number, y: number) {
        this.playerNameText.setPosition(x, y);
        this.playerNameText.setOrigin(0.5, 0.5)
    }
}