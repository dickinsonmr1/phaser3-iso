import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";
import { VehicleType } from '../gameobjects/player/player';
import { IconValueMapping, Menu } from './menu';

 
 export class TitleScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    menu: Menu;

    infoText: Phaser.GameObjects.Text;
    infoTextAlpha: number;
    infoTextExpiryGameTime: number;

    playerHUDOverlayComponents: PlayerHUDOverlayComponent[]

    private get InfoTextStartX(): number {return this.game.canvas.width / 2; }
    private get InfoTextStartY(): number {return this.game.canvas.height - this.game.canvas.height / 4; }   
    private get infoTextFontSize(): number { return 48; }

    
    backKey: Phaser.Input.Keyboard.Key;
    selectKey: Phaser.Input.Keyboard.Key;
    cursorUp: Phaser.Input.Keyboard.Key;
    cursorDown: Phaser.Input.Keyboard.Key;
    cursorLeft: Phaser.Input.Keyboard.Key;
    cursorRight: Phaser.Input.Keyboard.Key;

    private selectedVehicleIndex: number = 0;
    private selectedVehicleSprite: Phaser.GameObjects.Sprite;

    //healthText;
    //turboText;
    //rocketCountText;

    sceneController: SceneController

    constructor(sceneController: SceneController){
        super({key: "TitleScene"});

        this.sceneController = sceneController;
    }

    preload () {
        this.load.image('deathIcon', './assets/sprites/HUD/skull.png');
        this.load.image('shieldIcon', './assets/sprites/HUD/skull.png');

        this.load.atlasXML('blueCars', './assets/vehicles/spritesheet-bluecars-all.png', './assets/vehicles/sprites-bluecars-all.xml');        
        this.load.atlasXML('orangeCars', './assets/vehicles/spritesheet-orangecars-all.png', './assets/vehicles/sprites-orangecars-all.xml');        
        this.load.atlasXML('whiteCars', './assets/vehicles/spritesheet-whitecars-all.png', './assets/vehicles/sprites-whitecars-all.xml');        
        this.load.atlasXML('yellowCars', './assets/vehicles/spritesheet-yellowcars-all.png', './assets/vehicles/sprites-yellowcars-all.xml');        
        this.load.atlasXML('blackCars', './assets/vehicles/spritesheet-blackcars-all.png', './assets/vehicles/sprites-blackcars-all.xml');        
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

        var framerate = 10;

        var startIndex = 272;
        this.anims.create({
            key: 'select-raceCarBlue',//this.animPrefix + '-SSW',
            frames: [
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++},
                {key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        startIndex = 161;
        this.anims.create({
            key: 'select-pickupTruckOrange',//this.animPrefix + '-SSW',
            frames: [
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++},
                {key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        startIndex = 129;
        this.anims.create({
            key: 'select-vanWhite',//this.animPrefix + '-SSW',
            frames: [
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++},
                {key: 'whiteCars', frame: 'c09_s128_iso_0' + startIndex++}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        startIndex = 1;
        this.anims.create({
            key: 'select-taxiYellow',//this.animPrefix + '-SSW',
            frames: [
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_000' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++},
                {key: 'yellowCars', frame: 'c10_s128_iso_00' + startIndex++}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        startIndex = 97;
        this.anims.create({
            key: 'select-hearseBlack',//this.animPrefix + '-SSW',
            frames: [
                {key: 'blackCars', frame: 'c07_s128_iso_00' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_00' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_00' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++},
                {key: 'blackCars', frame: 'c07_s128_iso_0' + startIndex++}
            ],
            frameRate: framerate,
            repeat: -1,            
        });



        this.selectedVehicleSprite = this.add.sprite(500, 500, 'deathIcon');
        this.selectedVehicleSprite.setDisplaySize(256, 256);
        this.selectedVehicleSprite.play('select-pickupTruckOrange');

        this.menu = new Menu(this, false);
        this.menu.setTitle(this, "Select Vehicle");
        this.menu.setTitleIcon(this, 'deathIcon', '', 1);
        this.menu.setMarker(this, ">>");        
        var temp = new Array<IconValueMapping>();

        temp.push(new IconValueMapping({description: 'Speed Demon', texture: 'deathIcon', frame: '', scale: 1}));
        temp.push(new IconValueMapping({description: 'Taxi', texture: 'shieldIcon', frame: '', scale: 1}));
        temp.push(new IconValueMapping({description: 'Ambulance', texture: 'deathIcon', frame: '', scale: 1}));
        temp.push(new IconValueMapping({description: 'Hearse', texture: 'shieldIcon', frame: '', scale: 1}));
        temp.push(new IconValueMapping({description: 'Guerilla', texture: 'deathIcon', frame: '', scale: 1}));
        this.menu.addMenuComplexItemWithIcons(this, "Vehicle", temp);
        this.menu.addMenuItem(this, "Confirm Selection");    

        

        /*
        ourGame.events.on('updateFPS', function (delta) {
            this.fpsText.setText('FPS: ' + (1000/delta).toFixed(3));// + '\n' +            
            
        }, this);
        */

        //this.playerHUDOverlayComponents = new Array<PlayerHUDOverlayComponent>();
        //this.playerHUDOverlayComponents.push(new PlayerHUDOverlayComponent(this, "Police", 100, 100));

        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    
    update(): void {

        //if(Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            //this.returnToGame();
        //}

        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {

            if(this.menu.selectedItemIndex == 0) {
               //this.returnToGame();

               //this.menu.confirmSelection(this.sound);
            }
            else if(this.menu.selectedItemIndex == 1) {
                //this.menu.trySelectNextSubItem(this.sound);
                this.sceneController.launchGame(VehicleType.PickupTruck);
            }
            else if(this.menu.selectedItemIndex == 2) {
                //this.endGameAndReturnToTitleMenu();

                //this.sound.play("backSound");
            }
        }
         
        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menu.selectPreviousItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menu.selectNextItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {
            this.menu.trySelectPreviousSubItem(this.sound);
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.menu.trySelectNextSubItem(this.sound);
        }


        var selectionChanged = false;
        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {  
            this.selectedVehicleIndex--;    
            selectionChanged = true;
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.selectedVehicleIndex++;
            selectionChanged = true;
        }

        if(selectionChanged) {            
            if(this.selectedVehicleIndex < 0) this.selectedVehicleIndex = VehicleType.Hearse;
            if(this.selectedVehicleIndex > VehicleType.Hearse) this.selectedVehicleIndex = 0;

            this.infoText.setText(this.selectedVehicleIndex.toString());
    
            switch(this.selectedVehicleIndex) 
            {
                case VehicleType.RaceCar:
                    this.selectedVehicleSprite.play('select-raceCarBlue');
                    break;
                case VehicleType.PickupTruck:
                    this.selectedVehicleSprite.play('select-pickupTruckOrange');
                    break;
                case VehicleType.Ambulance:
                    this.selectedVehicleSprite.play('select-vanWhite');
                    break;
                case VehicleType.Taxi:
                    this.selectedVehicleSprite.play('select-taxiYellow');
                    break;
                case VehicleType.Hearse:
                    this.selectedVehicleSprite.play('select-hearseBlack');
                    break;
            }
        }       
    }
 }

 