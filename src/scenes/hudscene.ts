import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";
import { PickupType } from '../gameobjects/pickup';

 
 export class HudScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

    //playerId: string;

    playerHUDOverlayComponents: PlayerHUDOverlayComponent[]

    private get InfoTextStartX(): number {return this.game.canvas.width / 2; }
    private get InfoTextStartY(): number {return this.game.canvas.height - this.game.canvas.height / 4; }   
    private get infoTextFontSize(): number { return 48; }

    //healthText;
    //turboText;
    //rocketCountText;

    sceneController: SceneController

    constructor(sceneController: SceneController){
        super({key: "HudScene"});

        this.sceneController = sceneController;
    }

    preload () {
        this.load.atlas('ui', 'assets/ui/nine-slice.png', 'assets/ui/nine-slice.json');

        this.load.atlasXML('uiSpaceSprites', './assets/sprites/HUD/uipackSpace_sheet.png', './assets/sprites/HUD/uipackSpace_sheet.xml');        

        this.load.image('healthBarLeft', './assets/sprites/HUD/barHorizontal_red_left.png');
        this.load.image('healthBarMid', './assets/sprites/HUD/barHorizontal_red_mid.png');
        this.load.image('healthBarRight', './assets/sprites/HUD/barHorizontal_red_right.png');

        this.load.image('shieldBarLeft', './assets/sprites/HUD/barHorizontal_blue_left.png');
        this.load.image('shieldBarMid', './assets/sprites/HUD/barHorizontal_blue_mid.png');
        this.load.image('shieldBarRight', './assets/sprites/HUD/barHorizontal_blue_right.png');

        this.load.image('turboBarLeft', './assets/sprites/HUD/barHorizontal_yellow_left.png');
        this.load.image('turboBarMid', './assets/sprites/HUD/barHorizontal_yellow_mid.png');
        this.load.image('turboBarRight', './assets/sprites/HUD/barHorizontal_yellow_right.png');

        this.load.image('turboIcon', './assets/sprites/HUD/turboIcon.png');
        this.load.image('healthIcon', './assets/sprites/HUD/DPAD.png');
        this.load.image('shieldIcon', './assets/sprites/HUD/shield.png');
        this.load.image('specialIcon', './assets/sprites/HUD/specialIcon.png');
        this.load.image('shockwaveIcon', './assets/sprites/HUD/shockwaveIcon2.png');
    }
    
    create () {        
        this.fpsText = this.add.text(10, 10, 'FPS: -- \n-- Particles', {
            font: 'bold 26px Arial'
        });

        this.infoText = this.add.text(this.InfoTextStartX, this.InfoTextStartY, 'test',
        {
            font: 'bold 26px Arial'
            //fontFamily: 'Arial',
            //align: 'center',            
            //color:"rgb(255,255,255)",
        });
        this.infoText.setOrigin(0.5, 0.5);
        //this.infoText.setStroke('rgb(0,0,0)', 16);
        //this.infoText.setFontSize(this.infoTextFontSize);
        this.infoTextExpiryGameTime = this.game.getTime();

        //  Grab a reference to the Game Scene        
        let ourGame = this.scene.get('GameScene');
        ourGame.events.on('updateFPS', function (delta) {
            this.fpsText.setText('FPS: ' + (1000/delta).toFixed(3));// + '\n' +            
            
        }, this);

        ourGame.events.on('updatePlayerHealth', function (playerName, health) {
            this.fpsText.setText('Health: ' + health + '%');// + '\n' +            
            this.updatePlayerHealth(playerName, health);
        }, this);

        ourGame.events.on('playerRespawn', function (playerName) {       
            this.playerRespawn(playerName);
        }, this);

        ourGame.events.on('updatePlayerTurbo', function (playerName, turbo) {
            //this.fpsText.setText('Health: ' + health + '%');// + '\n' +            
            this.updatePlayerTurbo(playerName, turbo);
        }, this);

        ourGame.events.on('infoTextEmitted', function(text) {
            this.setInfoText(text);
        }, this);

        ourGame.events.on('playerPositionUpdated', function(playerName, x, y) {            
            this.updatePlayerPosition(playerName, x, y);
        }, this);

        ourGame.events.on('previousWeaponSelected', function(playerName, selectedWeaponType) {
            // todo: use selectedWeaponType from event
            this.selectPreviousWeapon(playerName);
        }, this);

        ourGame.events.on('nextWeaponSelected', function(playerName, selectedWeaponType) {
            // todo: use selectedWeaponType from event
            this.selectNextWeapon(playerName);
        }, this);

        ourGame.events.on('ammoUpdated', function(playerName, selectedWeaponType, ammoCount) {
            // todo: use selectedWeaponType from event
            this.selectNextWeapon(playerName);
        }, this);

        this.playerHUDOverlayComponents = new Array<PlayerHUDOverlayComponent>();       

        //var temp = this.add.nineslice(400, 300, 'buttons', 'enemy_hp_bar', 600, 400, 16, 16, 32, 16);        

        /*
        var bar1 = this.add.nineslice(400, 200, 'ui', 'ButtonOrange');
        var bar1fill = this.add.nineslice(286, 198, 'ui', 'ButtonOrangeFill2', 13, 39, 6, 6);
        bar1.setTint(0xFF726F);

        var temp2 = this.add.nineslice(400, 300, 'ui', 'enemy_hp_bar', 400, 50, 64, 64);
        var temp2 = this.add.nineslice(400, 320, 'ui', 'enemy_hp_fill', 400, 50, 64, 
        64);
        var temp2 = this.add.nineslice(400, 340, 'ui', 'hp_fill', 137, 10, 12, 12);

        var temp2 = this.add.nineslice(400, 460, 'ui', 'blue-box', 400, 10, 12, 12);

        var temp2 = this.add.nineslice(400, 480, 'ui', 'yellow_button02', 400, 24, 12, 12);
        var temp2 = this.add.nineslice(400, 500, 'ui', 'blue_button00', 400, 24, 12, 12);
        */

        /*
        var blueBar = this.add.nineslice(400, 600, 'ui', 'ButtonOrangeFill1', 100, 39, 6, 6);
        
        var greenBarOutline = this.add.nineslice(400, 640, 'ui', 'ButtonOrangeFill2', 100, 10, 6, 6);
        greenBarOutline.setScale(2, 2);
        greenBarOutline.setAlpha(0.2);
        
        var greenBar = this.add.nineslice(400, 640, 'ui', 'ButtonOrangeFill2', 200, 39, 6, 6);
        greenBarOutline.setScale(1, 0.5);
        */
        
        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    setOverlay(playerId: string, playerMaxHealth: number) {
        //this.playerId = playerId;
        this.playerHUDOverlayComponents.push(new PlayerHUDOverlayComponent(this, playerId, 100, 100, playerMaxHealth));
    }

    setInfoText(text: string, infoTextDurationInMs: number): void {
        this.infoText.setText(text);
        this.infoTextAlpha = 0.1;
        this.infoTextExpiryGameTime = this.game.getTime() + infoTextDurationInMs;

        this.infoText.setAlpha(this.infoTextAlpha);
    }

    updatePlayerPosition(name: string, x: number, y: number): void {
        /*
        let selectedPlayerGroup = this.playerHUDOverlayComponents.find(x => x.playerName == name).;
        if(selectedPlayerGroup != null) {
            selectedPlayerGroup[0].updateLocation(x, y);
        }
        */
    }

    updatePlayerHealth(name: string, currentHealth: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateHealth(currentHealth);
        }
    }
    
    updatePlayerTurbo(name: string, currentTurbo: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateTurbo(currentTurbo);
        }
    }

    playerRespawn(name: string) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].respawn();
        }
    }

    selectPreviousWeapon(name: string) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].selectPreviousWeapon();
        }
    }

    selectNextWeapon(name: string){
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].selectNextWeapon();
        }
    }

    updateAmmoCount(name: string, weaponType: PickupType, ammoCount: integer){
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateAmmo(weaponType, ammoCount);
        }
    }

    updateCpuBehaviorOverrideText(name: string, behaviorString: string) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerName == name);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateCpuBehaviorOverrideText(behaviorString);
        }
    }
    
    update(): void {
        if(this.game.getTime() < this.infoTextExpiryGameTime) {
            if(this.infoTextAlpha < 1) {
                this.infoTextAlpha += 0.1;
                this.infoText.setAlpha(this.infoTextAlpha);
            }
        }
        if(this.game.getTime() > this.infoTextExpiryGameTime) {
            if(this.infoTextAlpha > 0) {
                this.infoTextAlpha -= 0.05;
                this.infoText.setAlpha(this.infoTextAlpha);
            }
        }       
    }
 }
