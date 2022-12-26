import { HealthBar } from "../gameobjects/healthBar";

export class PlayerHUDOverlayComponent {
    hudGroup: Phaser.GameObjects.Group;

    weaponIcon: Phaser.GameObjects.Image;
    ammoText: Phaser.GameObjects.Text;
    playerNameText: Phaser.GameObjects.Text;

    healthBar: HealthBar;
    turboBar: HealthBar;    
}