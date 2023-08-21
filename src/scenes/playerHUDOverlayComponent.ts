import 'phaser';
import { HUDBarType, HealthBar } from "../gameobjects/healthBar";
import { HudScene } from "./hudscene";
import { Player } from "../gameobjects/player/player";
import { ProjectileType } from '../gameobjects/projectile';
import { PickupType } from '../gameobjects/pickup';

export class WeaponHudItem {

    scene: HudScene;

    startX: integer;
    startY: integer;

    ammoCount: integer;
    weaponText: Phaser.GameObjects.Text;
    weaponIcon: Phaser.GameObjects.Image;

    pickupType: PickupType;

    constructor(scene: HudScene, pickupType: PickupType, iconKey: string, startX: integer, startY: integer, ammoCount: integer) {

        this.scene = scene;

        this.pickupType = pickupType;

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

    selectItem() {
        this.weaponIcon.setTint(0xffffff);
        this.weaponIcon.setAlpha(1.0);

        this.weaponText.setTint(0xffffff);
        this.weaponText.setAlpha(1.0);
    }

    deselectItem() {
        this.weaponIcon.setTint(0xcccccc);
        this.weaponIcon.setAlpha(0.2);

        this.weaponText.setTint(0xcccccc);
        this.weaponText.setAlpha(0.2);
    } 

    updateAmmo(newAmmoCount: number) {
        this.ammoCount = newAmmoCount;
        this.weaponText.text = this.ammoCount.toString();
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

    livesIcons: Phaser.GameObjects.Image[] = [];

    ammoText: Phaser.GameObjects.Text;
    playerNameText: Phaser.GameObjects.Text;
    cpuBehaviorOverrideText: Phaser.GameObjects.Text;

    healthText: Phaser.GameObjects.Text;
    turboText: Phaser.GameObjects.Text;
    shieldText: Phaser.GameObjects.Text;

    healthBar: HealthBar;
    turboBar: HealthBar;    
    shieldBar: HealthBar;

    displayX: number;
    displayY: number;

    private get HealthBarStartX(): number {return this.scene.game.canvas.width / 16; }
    private get HealthBarStartY(): number {return this.scene.game.canvas.height - this.scene.game.canvas.height / 16; }   

    private get TurboBarStartY(): number {return this.HealthBarStartY - 50 };
    private get ShieldBarStartY(): number {return this.HealthBarStartY - 100 };

    selectedWeaponIcon: Phaser.GameObjects.Image;
    selectedWeaponItemIndex: integer = 0;

    constructor(scene: HudScene, playerName: string, x: number, y: number, playerMaxHealth: number) {
        this.scene = scene;
        this.displayX = x;
        this.displayY = y;
        this.playerName = playerName;    

        this.playerNameText = this.scene.add.text(x, y, playerName,
        {
            font: 'bold 26px Arial'
        });
        this.playerNameText.setOrigin(0.5, 0.5);

        
        this.cpuBehaviorOverrideText = this.scene.add.text(x, 300, 'CPU behavior override',
        {
            font: 'bold 26px Arial'
        });
        this.cpuBehaviorOverrideText.setOrigin(0.5, 0.5);

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
        this.healthBar.init(this.HealthBarStartX, this.HealthBarStartY, playerMaxHealth,            
            400, 40,
            0.75,
            HUDBarType.Health);

        this.turboBar = new HealthBar(this.scene);
        this.turboBar.init(this.HealthBarStartX, this.TurboBarStartY, Player.maxTurbo,
            200, 20,
            0.5,
            HUDBarType.Turbo);

        this.shieldBar = new HealthBar(this.scene);
        this.shieldBar.init(this.HealthBarStartX, this.ShieldBarStartY, Player.maxShield,
            200, 20,
            0.5,
            HUDBarType.Shield);

        this.livesIcons.push(this.scene.add.image(this.HealthBarStartX, this.ShieldBarStartY - 100, 'carIcon'));
        this.livesIcons.push(this.scene.add.image(this.HealthBarStartX + 100, this.ShieldBarStartY - 100, 'carIcon'));

        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Special, 'specialIcon', this.HealthBarStartX + 500, this.HealthBarStartY, 2));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Rocket, 'rocketIcon', this.HealthBarStartX + 600, this.HealthBarStartY, 5));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Flamethrower, 'fireIcon', this.HealthBarStartX + 700, this.HealthBarStartY, 20));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Airstrike, 'crosshair', this.HealthBarStartX + 800, this.HealthBarStartY, 1));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Shockwave, 'shockwaveIcon', this.HealthBarStartX + 900, this.HealthBarStartY, 3));
        this.weaponHudItems.push(new WeaponHudItem(this.scene, PickupType.Freeze, 'freezeIcon', this.HealthBarStartX + 1000, this.HealthBarStartY, 1));
        
        this.weaponHudItems[0].selectItem();
        this.weaponHudItems[1].deselectItem();
        this.weaponHudItems[2].deselectItem();
        this.weaponHudItems[3].deselectItem();
        this.weaponHudItems[4].deselectItem();
        this.weaponHudItems[5].deselectItem();
    }

    selectPreviousWeapon() {
        this.weaponHudItems[this.selectedWeaponItemIndex].deselectItem();

        --this.selectedWeaponItemIndex;
        if(this.selectedWeaponItemIndex < 0)
            this.selectedWeaponItemIndex = this.weaponHudItems.length - 1;

        this.weaponHudItems[this.selectedWeaponItemIndex].selectItem();
    }

    selectNextWeapon(){

        this.weaponHudItems[this.selectedWeaponItemIndex].deselectItem();

        ++this.selectedWeaponItemIndex;
        if(this.selectedWeaponItemIndex > this.weaponHudItems.length - 1)
            this.selectedWeaponItemIndex = 0;

        this.weaponHudItems[this.selectedWeaponItemIndex].selectItem();
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

    updateCpuBehaviorOverrideText(behavior: string) {        
        if(behavior != null) {
            if(!this.cpuBehaviorOverrideText.visible)
                this.cpuBehaviorOverrideText.setVisible(true);

            this.cpuBehaviorOverrideText.setText('CPU behavior: ' + behavior);
        }
        else {
            if(this.cpuBehaviorOverrideText.visible)
                this.cpuBehaviorOverrideText.setVisible(false);        
        }            
    }

    updateAmmo(weaponType: PickupType, ammoCount: number) {
        let filteredWeaponHudItems = this.weaponHudItems.filter(x => x.pickupType == weaponType);//.find(x => x.playerName == name);
        if(filteredWeaponHudItems != null && filteredWeaponHudItems[0] != null) {
            filteredWeaponHudItems[0].updateAmmo(ammoCount);
        }
    }

    respawn() {
        this.healthBar.show();
        this.turboBar.show();
    }
}