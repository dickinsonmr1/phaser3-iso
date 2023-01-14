
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

    private get IsoBoxHealthStartX(): number {return this.scene.game.canvas.width / 16; }
    private get IsoBoxHealthStartY(): number {return this.scene.game.canvas.height - this.scene.game.canvas.height / 16; }   

    private get IsoBoxTurboStartX(): number {return this.IsoBoxHealthStartX + 110; }
    private get IsoBoxShieldStartX(): number {return this.IsoBoxTurboStartX + 110; }

    isoBoxHealth: Phaser.GameObjects.IsoBox;
    isoBoxTurbo: Phaser.GameObjects.IsoBox;
    isoBoxShield: Phaser.GameObjects.IsoBox;

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

        var isoBoxHealthOutline = this.scene.add.isobox(this.IsoBoxHealthStartX, this.IsoBoxHealthStartY, 100, 200);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxHealthOutline.alpha = 0.1;    
        isoBoxHealthOutline.rotation = rotation;
        isoBoxHealthOutline.depth = 0;
        isoBoxHealthOutline.setOrigin(0.5, 1);
        //isoBoxHealthOutline.setProjection(90);
/*
        var isoBoxHealthOutlineBlack = this.scene.add.isobox(100, 400, 80, 200, 0x000000, 0x000000, 0x000000);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxHealthOutlineBlack.alpha = 1.0;    
        isoBoxHealthOutlineBlack.rotation = rotation;
        isoBoxHealthOutlineBlack.depth = 1;
        isoBoxHealthOutlineBlack.setOrigin(0.5, 1);
        //isoBoxHealthOutline.setProjection(90);
*/      
        this.isoBoxHealth = this.scene.add.isobox(this.IsoBoxHealthStartX, this.IsoBoxHealthStartY, 90, 150, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        this.isoBoxHealth.alpha = 0.7;    
        this.isoBoxHealth.rotation = rotation;
        this.isoBoxHealth.depth = 2;         
         
        var isoBoxTurboOutline = this.scene.add.isobox(this.IsoBoxTurboStartX, this.IsoBoxHealthStartY, 100, 200);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxTurboOutline.alpha = 0.1;  
        isoBoxTurboOutline.rotation = rotation;
        isoBoxTurboOutline.depth = 2;    

        topColor = 0xFFEA6F;
        leftColor = 0xFFEA6F;
        rightColor = 0xFFE65B;
        
        this.isoBoxTurbo = this.scene.add.isobox(this.IsoBoxTurboStartX, this.IsoBoxHealthStartY, 90, 25, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        this.isoBoxTurbo.alpha = 0.7;    
        this.isoBoxTurbo.rotation = rotation;  
        this.isoBoxTurbo.depth = 1;
        //isoBoxTurbo.rotation = Math.PI / 2;  
        
        var isoBoxShieldOutline = this.scene.add.isobox(this.IsoBoxShieldStartX, this.IsoBoxHealthStartY, 100, 200);//, params.topColor, params.leftColor, params.rightColor);
        isoBoxShieldOutline.alpha = 0.1;  
        isoBoxShieldOutline.rotation = rotation;
        isoBoxShieldOutline.depth = 2;    
        
        topColor = 0x6F84FF;
        leftColor = 0x2D4DFF;
        rightColor = 0x5B74FF;

        this.isoBoxShield = this.scene.add.isobox(this.IsoBoxShieldStartX, this.IsoBoxHealthStartY, 100, 50, topColor, leftColor, rightColor);//, params.topColor, params.leftColor, params.rightColor);
        this.isoBoxShield.alpha = 0.7;    
        this.isoBoxShield.rotation = rotation;  
        this.isoBoxShield.depth = 1;
        //isoBoxTurbo.rotation = Math.PI / 2;  

        //var isotriangle = this.scene.add.isotriangle(this.IsoBoxShieldStartX, this.IsoBoxHealthStartY, 100, 100, true);//, topColor, leftColor, rightColor);
        //isotriangle.showLeft = false;
        //isotriangle.showRight = false;
        //isotriangle.showTop = true;
    }

    updateLocation(x: number, y: number) {
        this.playerNameText.setPosition(x, y);
        this.playerNameText.setOrigin(0.5, 0.5)
    }

    updateHealth(currentHealth: number) {
        this.isoBoxHealth.height = currentHealth;
    }

    updateTurbo(currentTurbo: number) {
        this.isoBoxTurbo.height = currentTurbo;
    }
}