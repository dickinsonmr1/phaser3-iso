import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";

 
 export class HudScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

    playerHUDOverlayComponent: PlayerHUDOverlayComponent[]

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

        ourGame.events.on('updatePlayerHealth', function (health) {
            this.fpsText.setText('Health: ' + health + '%');// + '\n' +            

        }, this);

        ourGame.events.on('infoTextEmitted', function(text) {
            this.setInfoText(text);
        }, this);

        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    setInfoText(text: string, infoTextDurationInMs: number): void {
        this.infoText.setText(text);
        this.infoTextAlpha = 0.1;
        this.infoTextExpiryGameTime = this.game.getTime() + infoTextDurationInMs;

        this.infoText.setAlpha(this.infoTextAlpha);
    }

    updatePlayerPosition(): void {

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
