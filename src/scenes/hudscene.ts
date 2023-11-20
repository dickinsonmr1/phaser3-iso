import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";
import { PickupType } from '../gameobjects/pickup';
import { v4 as uuidv4 } from 'uuid';

 export class HudScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

    //playerId: string;

    playerHUDOverlayComponents: PlayerHUDOverlayComponent[] = new Array<PlayerHUDOverlayComponent>();       

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
        this.load.image('shockwaveIcon', './assets/sprites/HUD/shockwaveIcon3.png');
        this.load.image('lightningIcon', './assets/sprites/HUD/shockwaveIcon2.png');
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

        ourGame.events.on('updatePlayerHealth', function (playerId: uuidv4, health) {
            //this.fpsText.setText('Health: ' + health + '%');// + '\n' +            
            this.updatePlayerHealth(playerId, health);
        }, this);

        ourGame.events.on('playerRespawn', function (playerId: uuidv4) {       
            this.playerRespawn(playerId);
        }, this);

        ourGame.events.on('updatePlayerTurbo', function (playerId: uuidv4, turbo) {
            //this.fpsText.setText('Health: ' + health + '%');// + '\n' +            
            this.updatePlayerTurbo(playerId, turbo);
        }, this);

        ourGame.events.on('updatePlayerShield', function (playerId: uuidv4, shield) {
            //this.fpsText.setText('Health: ' + health + '%');// + '\n' +            
            this.updatePlayerShield(playerId, shield);
        }, this);


        ourGame.events.on('infoTextEmitted', function(text) {
            this.setInfoText(text);
        }, this);

        ourGame.events.on('playerPositionUpdated', function(playerId: uuidv4, x, y) {            
            this.updatePlayerPosition(playerId, x, y);
        }, this);

        ourGame.events.on('previousWeaponSelected', function(playerId: uuidv4, selectedWeaponType) {
            // todo: use selectedWeaponType from event
            this.selectPreviousWeapon(playerId);
        }, this);

        ourGame.events.on('nextWeaponSelected', function(playerId: uuidv4, selectedWeaponType) {
            // todo: use selectedWeaponType from event
            this.selectNextWeapon(playerId);
        }, this);

        ourGame.events.on('ammoUpdated', function(playerId: uuidv4, selectedWeaponType, ammoCount) {
            // todo: use selectedWeaponType from event
            this.selectNextWeapon(playerId);
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

    setOverlay(playerId: uuidv4, playerName: string, playerMaxHealth: number) {
        //this.playerId = playerId;
        this.playerHUDOverlayComponents.push(new PlayerHUDOverlayComponent(this, playerId, playerName, 100, 100, playerMaxHealth));
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

    updatePlayerHealth(playerId: uuidv4, currentHealth: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateHealth(currentHealth);
        }
    }
    
    updatePlayerTurbo(playerId: uuidv4, currentTurbo: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateTurbo(currentTurbo);
        }
    }
    
    updatePlayerShield(playerId: uuidv4, currentShield: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateShield(currentShield);
        }
    }

    playerRespawn(playerId: uuidv4) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].respawn();
        }
    }

    selectPreviousWeapon(playerId: uuidv4) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].selectPreviousWeapon();
        }
    }

    selectNextWeapon(playerId: uuidv4){
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].selectNextWeapon();
        }
    }

    updateAmmoCount(playerId: uuidv4, weaponType: PickupType, ammoCount: integer){
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateAmmo(weaponType, ammoCount);
        }
    }

    updateCpuBehaviorOverrideText(playerId: uuidv4, behaviorString: string) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateCpuBehaviorOverrideText(behaviorString);
        }
    }

    updateCpuWeaponOverrideText(playerId: uuidv4, behaviorString: string) {
        let selectedPlayerGroup = this.playerHUDOverlayComponents.filter(x => x.playerId == playerId);//.find(x => x.playerName == name);
        if(selectedPlayerGroup != null && selectedPlayerGroup[0] != null) {
            selectedPlayerGroup[0].updateCpuWeaponOverrideText(behaviorString);
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
