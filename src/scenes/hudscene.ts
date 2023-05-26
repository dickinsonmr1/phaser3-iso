import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";

 
 export class HudScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

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

        this.playerHUDOverlayComponents = new Array<PlayerHUDOverlayComponent>();
        this.playerHUDOverlayComponents.push(new PlayerHUDOverlayComponent(this, "Police", 100, 100));

        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    setInfoText(text: string, infoTextDurationInMs: number): void {
        this.infoText.setText(text);
        this.infoTextAlpha = 0.1;
        this.infoTextExpiryGameTime = this.game.getTime() + infoTextDurationInMs;

        this.infoText.setAlpha(this.infoTextAlpha);
    }

    updatePlayerPosition(name: string, x: number, y: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.find(x => x.playerName == name);
        if(selectedPlayerGroup != null) {
            selectedPlayerGroup.updateLocation(x, y);
        }
    }

    updatePlayerHealth(name: string, currentHealth: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.find(x => x.playerName == name);
        if(selectedPlayerGroup != null) {
            selectedPlayerGroup.updateHealth(currentHealth);
        }
    }
    
    updatePlayerTurbo(name: string, currentTurbo: number): void {

        let selectedPlayerGroup = this.playerHUDOverlayComponents.find(x => x.playerName == name);
        if(selectedPlayerGroup != null) {
            selectedPlayerGroup.updateTurbo(currentTurbo);
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
