
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
    }

    updateLocation(x: number, y: number) {
        this.playerNameText.setPosition(x, y);
        this.playerNameText.setOrigin(0.5, 0.5)
    }
}