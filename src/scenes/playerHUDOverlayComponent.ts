import 'phaser';
import { HUDBarType, HealthBar } from "../gameobjects/healthBar";
import { IsoBoxHealthBar, IsoHudBarType } from "../gameobjects/isoBoxHealthBar";
import { HudScene } from "./hudscene";
import { Player } from "../gameobjects/player/player";

export class WeaponHudItem {

    scene: HudScene;

    startX: integer;
    startY: integer;

    ammoCount: integer;
    weaponText: Phaser.GameObjects.Text;
    weaponIcon: Phaser.GameObjects.Image;

    constructor(scene: HudScene, iconKey: string, startX: integer, startY: integer, ammoCount: integer) {

        this.scene = scene;

        this.startX = startX;
        this.startY = startY;

        this.ammoCount = ammoCount;

        this.weaponText = this.scene.add.text(this.startX, this.startY - 60, this.ammoCount.toString());
        this.weaponText.setOrigin(0.5, 0.5);
        this.weaponText.setFontSize(32);

        this.weaponIcon = this.scene.add.image(this.startX, this.startY, iconKey);
        this.weaponIcon.setOrigin(0.5, 0.5);
        this.weaponIcon.setAlpha(1.0);
    }
}

export class PlayerHUDOverlayComponent {

    scene: HudScene;
    playerName: string;
    hudGroup: Phaser.GameObjects.Group;

    weaponIcon1: Phaser.GameObjects.Image;
    weaponIcon2: Phaser.GameObjects.Image;
    weaponIcon3: Phaser.GameObjects.Image;
    weaponIcon4: Phaser.GameObjects.Image;
    weaponIcon5: Phaser.GameObjects.Image;

    weaponHudItems: WeaponHudItem[] = [];

    ammoText: Phaser.GameObjects.Text;
    playerNameText: Phaser.GameObjects.Text;

    healthText: Phaser.GameObjects.Text;
    turboText: Phaser.GameObjects.Text;
    shieldText: Phaser.GameObjects.Text;

    healthBar: HealthBar;
    turboBar: HealthBar;    
    shieldBar: HealthBar;

    displayX: number;
    displayY: number;

    private get IsoBoxHealthStartX(): number {return this.scene.game.canvas.width / 16; }
    private get IsoBoxHealthStartY(): number {return this.scene.game.canvas.height - this.scene.game.canvas.height / 16; }   

    private get IsoBoxTurboStartY(): number {return this.IsoBoxHealthStartY - 50 };
    private get IsoBoxShieldStartY(): number {return this.IsoBoxHealthStartY - 100 };

    //private get IsoBoxTurboStartX(): number {return this.IsoBoxHealthStartX + 110; }
    //private get IsoBoxShieldStartX(): number {return this.IsoBoxTurboStartX - 110; }
    //private get IsoBoxTextStartY(): number {return this.IsoBoxHealthStartY - 250; }

    //isoBoxHealthBar: IsoBoxHealthBar;
    //isoBoxTurboBar: IsoBoxHealthBar;
    //isoBoxShieldBar: IsoBoxHealthBar;

    //isoBoxHealth: Phaser.GameObjects.IsoBox;
    //isoBoxTurbo: Phaser.GameObjects.IsoBox;
    //isoBoxShield: Phaser.GameObjects.IsoBox;

    selectedWeaponIcon: Phaser.GameObjects.Image;

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

        /*
        this.healthText = this.scene.add.text(this.IsoBoxHealthStartX, this.IsoBoxTextStartY, "+",
        {
            font: 'bold 36px Arial'
        });
        this.healthText.setOrigin(0.5, 0.5);
        this.healthText.setDepth(1);

        this.turboText = this.scene.add.text(this.IsoBoxTurboStartX, this.IsoBoxTextStartY, ">>",
        {
            font: 'bold 26px Arial'
        });
        this.turboText.setOrigin(0.5, 0.5);
        this.turboText.setDepth(1);

        this.shieldText = this.scene.add.text(this.IsoBoxShieldStartX, this.IsoBoxTextStartY, "Shield",
        {
            font: 'bold 26px Arial'
        });
        this.shieldText.setOrigin(0.5, 0.5);
        this.shieldText.setDepth(1);
        */

        this.healthBar = new HealthBar(this.scene);
        this.healthBar.init(this.IsoBoxHealthStartX, this.IsoBoxHealthStartY, Player.maxHealth,            
            400, 40,
            0.5,
            HUDBarType.Health);

        this.turboBar = new HealthBar(this.scene);
        this.turboBar.init(this.IsoBoxHealthStartX, this.IsoBoxTurboStartY, Player.maxTurbo,
            200, 20,
            0.5,
            HUDBarType.Turbo);

        this.shieldBar = new HealthBar(this.scene);
        this.shieldBar.init(this.IsoBoxHealthStartX, this.IsoBoxShieldStartY, Player.maxShield,
            200, 20,
            0.5,
            HUDBarType.Shield);
                    
        //this.selectedWeaponIcon = this.scene.add.image(this.IsoBoxHealthStartX + 500, this.IsoBoxHealthStartY, 'specialIcon');
        //this.selectedWeaponIcon.setOrigin(0.5, 0.5);

        this.weaponHudItems.push(new WeaponHudItem(this.scene, 'specialIcon', this.IsoBoxHealthStartX + 500, this.IsoBoxHealthStartY, 2));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, 'rocketIcon', this.IsoBoxHealthStartX + 600, this.IsoBoxHealthStartY, 5));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, 'fireIcon', this.IsoBoxHealthStartX + 700, this.IsoBoxHealthStartY, 20));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, 'crosshair', this.IsoBoxHealthStartX + 800, this.IsoBoxHealthStartY, 1));
        
        /*
        this.isoBoxHealthBar = new IsoBoxHealthBar(this.scene);
        this.isoBoxHealthBar.init(this.scene, this.IsoBoxHealthStartX, this.IsoBoxHealthStartY, Player.maxHealth, 100, 200, IsoHudBarType.Health);

        this.isoBoxTurboBar = new IsoBoxHealthBar(this.scene);
        this.isoBoxTurboBar.init(this.scene, this.IsoBoxTurboStartX, this.IsoBoxHealthStartY, Player.maxTurbo, 50, 200, IsoHudBarType.Turbo);
         
        this.isoBoxShieldBar = new IsoBoxHealthBar(this.scene);
        this.isoBoxShieldBar.init(this.scene, this.IsoBoxShieldStartX, this.IsoBoxHealthStartY, Player.maxShield, 150, 200, IsoHudBarType.Shield);
              
        var isotriangle = this.scene.add.isotriangle(this.IsoBoxShieldStartX, this.IsoBoxHealthStartY, 100, 100, true);//, topColor, leftColor, rightColor);
        isotriangle.showLeft = false;
        isotriangle.showRight = false;
        isotriangle.showTop = true;
        */
    }

    updateLocation(x: number, y: number) {
        this.playerNameText.setPosition(x, y);
        this.playerNameText.setOrigin(0.5, 0.5)
    }

    updateHealth(currentHealth: number) {
        this.healthBar.updateHealth(currentHealth);
        if(currentHealth > 0)
            this.healthBar.show();
    }

    updateTurbo(currentTurbo: number) {
        this.turboBar.updateHealth(currentTurbo);
        if(currentTurbo > 0)
            this.turboBar.show();   
    }

    respawn() {
        this.healthBar.show();
        this.turboBar.show();
    }
}