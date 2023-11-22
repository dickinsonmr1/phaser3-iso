import * as Phaser from 'phaser';
import { SceneController } from './sceneController';
import { MenuController } from './menuController';
import { Constants } from '../constants';
import { MenuKeyValueMapping, MenuPage, ReturnToTitleMenuItem, UnpauseGameMenuItem } from './menuPage';

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

    mostRecentGamepadPauseKey: boolean = false;

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
        
        var backgroundRectangle = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height/2, this.game.canvas.width, this.game.canvas.height, 0x333333, 0.4);

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
        
        var pauseMenuPage = new MenuPage(this, "Pause", false, false);

        ///////////////////////////////////
        // title menu
        ///////////////////////////////////
        pauseMenuPage.setTitle(this, "Game Paused");
        pauseMenuPage.setMarker(this, ">>")
        pauseMenuPage.addUnpauseGameMenuItem(this, "Return to Game");   

        var controlMenuItemMappings = new Array<MenuKeyValueMapping>();
        controlMenuItemMappings.push(new MenuKeyValueMapping({description: "Default", selectedIndex: 0}));
        controlMenuItemMappings.push(new MenuKeyValueMapping({description: "Driving", selectedIndex: 1}));
        pauseMenuPage.addMenuComplexItem(this, "Controls", controlMenuItemMappings);

        var soundMenuItemMappings = new Array<MenuKeyValueMapping>();
        soundMenuItemMappings.push(new MenuKeyValueMapping({description: "On", selectedIndex: 0}));
        soundMenuItemMappings.push(new MenuKeyValueMapping({description: "Off", selectedIndex: 1}));
        pauseMenuPage.addMenuComplexItem(this, "Sound", soundMenuItemMappings);

        pauseMenuPage.addReturnToTitleMenuItem(this, "Exit to Main Menu");
      
        // adding menus to menu controller in order        
        this.menuController.addMenu(pauseMenuPage);

        this.scene.setVisible(true);
        this.scene.bringToTop();

        this.addGamepadListeners();   
    }

    update(): void {

        if(this.gamepad != null) {
            if(this.gamepad.isButtonDown(Constants.gamepadIndexPause)) {
                if(!this.mostRecentGamepadPauseKey) {

                    this.returnToGame();

                    this.mostRecentGamepadPauseKey = true;
                }
            }
            else {
                this.mostRecentGamepadPauseKey = false;              
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {
    
            var returnToGameOrTitle = this.menuController.confirmSelection();
            if(returnToGameOrTitle)
            {
                var itemJustConfirmed = this.menuController.getSelectedMenuPageItem();
                if(itemJustConfirmed instanceof UnpauseGameMenuItem)
                    this.returnToGame();
                else if(itemJustConfirmed instanceof ReturnToTitleMenuItem)
                    this.returnToTitle();
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.backKey)) {
            this.menuController.returnToLastScreen();            
        }
         
        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menuController.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menuController.selectNextItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {
            this.menuController.selectPreviousSubItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.menuController.selectNextSubItem();
        }
    }

    returnToGame(): void {
        this.input.keyboard.resetKeys();
        
        if(this.input.gamepad.pad1 != null)
            this.input.gamepad.pad1.removeAllListeners();

        this.sceneController.returnToGame();
    }
    
    returnToTitle(): void {
        this.input.keyboard.resetKeys();
        this.sceneController.returnToTitleScene();
    }

    addGamepadListeners(): void {
        if(this.input.gamepad.pad1 != null)
        {
            this.gamepad = this.input.gamepad.pad1;
            this.gamepad.on('down', (index, value, button) => {

                switch(index) {
                    case Constants.gamepadIndexSelect:
                        console.log('A');
                        var returnToGameOrTitle = this.menuController.confirmSelection();
                        if(returnToGameOrTitle)
                        {
                            var itemJustConfirmed = this.menuController.getSelectedMenuPageItem();
                            if(itemJustConfirmed instanceof UnpauseGameMenuItem)
                                this.returnToGame();
                            else if(itemJustConfirmed instanceof ReturnToTitleMenuItem)
                                this.returnToTitle();
                        }
                        break;
                    case Constants.gamepadIndexPause:
                    case Constants.gamepadIndexBack:
                        //this.returnToGame();    
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
}