import * as Phaser from 'phaser';
import { SceneController } from './sceneController';
import { MenuController } from './menuController';
import { Constants } from '../constants';
import { MenuPage } from './menuPage';

export class PauseScene extends Phaser.Scene {

    fpsText: Phaser.GameObjects.Text;

    menuController: MenuController;
    
    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

    private get InfoTextStartX(): number {return this.game.canvas.width / 2; }
    private get InfoTextStartY(): number {return this.game.canvas.height - this.game.canvas.height / 4; }   
    private get infoTextFontSize(): number { return 48; }
    
    backKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;
    cursorLeft: Phaser.Input.Keyboard.Key;
    cursorRight: Phaser.Input.Keyboard.Key;

    gamepad: Phaser.Input.Gamepad.Gamepad;
    sceneController: SceneController

    constructor(sceneController: SceneController){
        super({key: "PauseScene"});

        this.sceneController = sceneController;

        this.gamepad = null;
    }

    create () {
        this.backKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.cursorLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.cursorRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.fpsText = this.add.text(10, 10, 'FPS: -- \n-- Particles', {
            font: 'bold 26px Arial'
        });

        this.infoText = this.add.text(this.InfoTextStartX, this.InfoTextStartY, 'test',
        {
            font: 'bold 26px Arial'
        });
        this.infoText.setOrigin(0.5, 0.5);        
        this.infoTextExpiryGameTime = this.game.getTime();

        var framerate = 10;

        this.menuController = new MenuController()
        
        var pauseMenuPage = new MenuPage(this, false);        

        ///////////////////////////////////
        // title menu
        ///////////////////////////////////
        pauseMenuPage.setTitle(this, "Game Paused");
        pauseMenuPage.setMarker(this, "•")
        //pauseMenuPage.setTitleIcon(this, 'carIcon', 'carIcon', 1);
        //pauseMenuPage.setFooter(this, "Copyright 2023 by Mark Dickinson")
        pauseMenuPage.addUnpauseGameMenuItem(this, "Return to Game");   
        pauseMenuPage.addMenuItem(this, "Exit to Main Menu");
        //pauseMenuPage.addMenuLinkItem(this, "Single Player", mapSelectionMenuPage);
        //pauseMenuPage.addMenuLinkItem(this, "Multiplayer", mapSelectionMenuPage);
        //pauseMenuPage.addMenuLinkItem(this, "Options", mapSelectionMenuPage);

      
        // adding menus to menu controller in order        
        this.menuController.addMenu(pauseMenuPage);

        this.scene.setVisible(true);
        this.scene.bringToTop();

        this.addGamepadListeners();   
    }

    returnToGame(): void {
        this.sceneController.returnToGame();
    }

    addGamepadListeners(): void {
        this.gamepad = this.input.gamepad.pad1;
        this.gamepad.on('down', (index, value, button) => {

            switch(index) {
                case Constants.gamepadIndexSelect:
                    console.log('A');
                    var returnToGame = this.menuController.confirmSelection();
                    if(returnToGame)
                    {
                        this.returnToGame();
                    }
                    break;
                case Constants.gamepadIndexPause:
                case Constants.gamepadIndexBack:
                    this.returnToGame();
                    break;
                case Constants.gamepadIndexInteract:
                    console.log('X');
                    break;
                case Constants.gamepadIndexUp:
                    console.log('Up');
                    this.menuController.selectPreviousItem();
                    break;
                case Constants.gamepadIndexDown:
                    console.log('Down');
                    this.menuController.selectNextItem();
                    break;
                case Constants.gamepadIndexLeft:
                case Constants.gamepadIndexLB:
                    this.menuController.selectPreviousSubItem();
                    console.log('Left');
                    break;
                case Constants.gamepadIndexRight:
                case Constants.gamepadIndexRB:
                    console.log('Right');
                    this.menuController.selectNextSubItem();
                    break;
            }                
        });
    }
}