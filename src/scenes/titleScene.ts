import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";
import { VehicleType } from '../gameobjects/player/player';
import { ComplexMenuItem, IconValueMapping, MenuPage } from './menuPage';
import { MenuController } from './menuController';
import { Constants } from '../constants';

 
 export class TitleScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

    //mapSelectionMenu: MenuPage;
    //vehicleSelectionMenu: MenuPage;

    menuController: MenuController;
    
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

    gamepad: Phaser.Input.Gamepad.Gamepad;

    //private selectedVehicleIndex: number = 0;
    //private selectedVehicleSprite: Phaser.GameObjects.Sprite;

    //healthText;
    //turboText;
    //rocketCountText;

    sceneController: SceneController

    constructor(sceneController: SceneController){
        super({key: "TitleScene"});

        this.sceneController = sceneController;

        this.gamepad = null;
    }

    preload () {
        this.load.image('deathIcon', './assets/sprites/HUD/skull.png');
        this.load.image('shieldIcon', './assets/sprites/HUD/shield.png');
        this.load.image('carIcon', './assets/sprites/HUD/carIcon.png');

        this.load.atlasXML('blueCars', './assets/vehicles/spritesheet-bluecars-all.png', './assets/vehicles/sprites-bluecars-all.xml');        
        this.load.atlasXML('orangeCars', './assets/vehicles/spritesheet-orangecars-all.png', './assets/vehicles/sprites-orangecars-all.xml');        
        this.load.atlasXML('whiteCars', './assets/vehicles/spritesheet-whitecars-all.png', './assets/vehicles/sprites-whitecars-all.xml');        
        this.load.atlasXML('yellowCars', './assets/vehicles/spritesheet-yellowcars-all.png', './assets/vehicles/sprites-yellowcars-all.xml');        
        this.load.atlasXML('blackCars', './assets/vehicles/spritesheet-blackcars-all.png', './assets/vehicles/sprites-blackcars-all.xml');        
        this.load.atlasXML('killdozer256', './assets/vehicles/sprites-killdozer.png', './assets/vehicles/sprites-killdozer.xml');        
        this.load.atlasXML('monstertruck256', './assets/vehicles/sprites-monstertruck256.png', './assets/vehicles/sprites-monstertruck256.xml');        
    }
    
    create () {

        this.backKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.cursorDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.cursorUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.cursorLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.cursorRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        this.addGamepadListeners();   

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
        //let ourGame = this.scene.get('GameScene');

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

        this.anims.create({
            key: 'select-killdozer',//this.animPrefix + '-SSW',
            frames: [
                {key: 'killdozer256', frame: 'killdozer_SW'},
                {key: 'killdozer256', frame: 'killdozer_W_SW'},
                {key: 'killdozer256', frame: 'killdozer_W'},
                {key: 'killdozer256', frame: 'killdozer_W_NW'},
                {key: 'killdozer256', frame: 'killdozer_NW'},
                {key: 'killdozer256', frame: 'killdozer_N_NW'},
                {key: 'killdozer256', frame: 'killdozer_N'},
                {key: 'killdozer256', frame: 'killdozer_N_NE'},
                {key: 'killdozer256', frame: 'killdozer_NE'},
                {key: 'killdozer256', frame: 'killdozer_E_NE'},
                {key: 'killdozer256', frame: 'killdozer_E'},
                {key: 'killdozer256', frame: 'killdozer_E_SE'},
                {key: 'killdozer256', frame: 'killdozer_SE'},
                {key: 'killdozer256', frame: 'killdozer_S_SE'},
                {key: 'killdozer256', frame: 'killdozer_S'},
                {key: 'killdozer256', frame: 'killdozer_S_SW'}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        this.anims.create({
            key: 'select-monstertruck',//this.animPrefix + '-SSW',
            frames: [
                {key: 'monstertruck256', frame: 'monstertruck256_SW'},
                {key: 'monstertruck256', frame: 'monstertruck256_W_SW'},
                {key: 'monstertruck256', frame: 'monstertruck256_W'},
                {key: 'monstertruck256', frame: 'monstertruck256_W_NW'},
                {key: 'monstertruck256', frame: 'monstertruck256_NW'},
                {key: 'monstertruck256', frame: 'monstertruck256_N_NW'},
                {key: 'monstertruck256', frame: 'monstertruck256_N'},
                {key: 'monstertruck256', frame: 'monstertruck256_N_NE'},
                {key: 'monstertruck256', frame: 'monstertruck256_NE'},
                {key: 'monstertruck256', frame: 'monstertruck256_E_NE'},
                {key: 'monstertruck256', frame: 'monstertruck256_E'},
                {key: 'monstertruck256', frame: 'monstertruck256_E_SE'},
                {key: 'monstertruck256', frame: 'monstertruck256_SE'},
                {key: 'monstertruck256', frame: 'monstertruck256_S_SE'},
                {key: 'monstertruck256', frame: 'monstertruck256_S'},
                {key: 'monstertruck256', frame: 'monstertruck256_S_SW'}
            ],
            frameRate: framerate,
            repeat: -1,            
        });



        //this.selectedVehicleSprite = this.add.sprite(500, 500, 'deathIcon');
        //this.selectedVehicleSprite.setDisplaySize(256, 256);
        //this.selectedVehicleSprite.play('select-pickupTruckOrange');

        this.menuController = new MenuController()
        
        
        var titleMenu = new MenuPage(this, false);        
        var mapSelectionMenu = new MenuPage(this, false);
        var vehicleSelectionMenu = new MenuPage(this, false);

        ///////////////////////////////////
        // title menu
        ///////////////////////////////////
        titleMenu.setTitle(this, "Vehicular Vengeance");
        titleMenu.setMarker(this, "•")
        titleMenu.setTitleIcon(this, 'carIcon', 'carIcon', 1);
        titleMenu.setFooter(this, "Copyright 2023 by Mark Dickinson")
        titleMenu.addStartGameMenuItem(this, "Instant Action");    
        titleMenu.addMenuLinkItem(this, "Single Player", mapSelectionMenu);
        titleMenu.addMenuLinkItem(this, "Multiplayer", mapSelectionMenu);
        titleMenu.addMenuLinkItem(this, "Options", mapSelectionMenu);

        ///////////////////////////////////
        // map selection menu  
        ///////////////////////////////////
        mapSelectionMenu.setTitle(this, "Select Map");
        mapSelectionMenu.setTitleIcon(this, 'shieldIcon', '', 1);
        mapSelectionMenu.setMarker(this, "•");

        var mapIcons = new Array<IconValueMapping>();
        mapIcons.push(new IconValueMapping({description: 'Forest', key: 'deathIcon', scale: 3, selectedIndex: 0}));
        mapIcons.push(new IconValueMapping({description: 'Quarry', key: 'shieldIcon', scale: 3, selectedIndex: 1}));
        mapIcons.push(new IconValueMapping({description: 'Desert', key: 'deathIcon', scale: 3, selectedIndex: 2}));
        mapSelectionMenu.addMenuComplexItemWithIcons(this, "Map", mapIcons);
        mapSelectionMenu.addMenuLinkItem(this, "Next", vehicleSelectionMenu);    
             
        ///////////////////////////////////
        // vehicle selection menu
        ///////////////////////////////////
        vehicleSelectionMenu.setTitle(this, "Select Vehicle");
        vehicleSelectionMenu.setTitleIcon(this, 'deathIcon', '', 1);
        vehicleSelectionMenu.setMarker(this, "•");        
        var vehicleSprites = new Array<IconValueMapping>();
        
        vehicleSprites.push(new IconValueMapping({description: 'Taxi', key: 'select-taxiYellow', scale: 3, selectedIndex: VehicleType.Taxi, armorRating: 3, speedRating: 4, specialRating: 2, specialDescription: "Horn"}));
        vehicleSprites.push(new IconValueMapping({description: 'Ambulance', key: 'select-vanWhite', scale: 3, selectedIndex: VehicleType.Ambulance, armorRating: 3, speedRating: 2, specialRating: 3, specialDescription: "Siren"}));
        vehicleSprites.push(new IconValueMapping({description: 'Speed Demon', key: 'select-raceCarBlue', scale: 3, selectedIndex: VehicleType.RaceCar, armorRating: 2, speedRating: 5, specialRating: 2, specialDescription: "Buzzsaw"}));
        vehicleSprites.push(new IconValueMapping({description: 'Guerilla', key: 'select-pickupTruckOrange', scale: 3, selectedIndex: VehicleType.PickupTruck, armorRating: 3, speedRating: 3, specialRating: 4, specialDescription: "Flamethrower"}));
        vehicleSprites.push(new IconValueMapping({description: 'Hearse', key: 'select-hearseBlack', scale: 3, selectedIndex: VehicleType.Hearse, armorRating: 4, speedRating: 2, specialRating: 2, specialDescription: "EMP"}));                
        vehicleSprites.push(new IconValueMapping({description: 'Killdozer', key: 'select-killdozer', scale: 0.75, selectedIndex: VehicleType.Killdozer, armorRating: 5, speedRating: 1, specialRating: 4, specialDescription: "Slamtime"}));                
        vehicleSprites.push(new IconValueMapping({description: 'Monster Truck', key: 'select-monstertruck', scale: 0.75, selectedIndex: VehicleType.MonsterTruck, armorRating: 5, speedRating: 3, specialRating: 2, specialDescription: "Slamtime"}));                
        var complexMenuItem = vehicleSelectionMenu.addMenuComplexItemWithIcons(this, "Vehicle", vehicleSprites);
        
        vehicleSelectionMenu.setInitialStats(this, complexMenuItem);

        vehicleSelectionMenu.addStartGameMenuItem(this, "Confirm Selection");    
        

        // adding menus to menu controller in order        
        this.menuController.addMenu(titleMenu);
        this.menuController.addMenu(mapSelectionMenu);
        this.menuController.addMenu(vehicleSelectionMenu);


        /*
        var text = this.add.text(this.game.canvas.width * 0.75, this.game.canvas.height * 0.5, "Armor:   • • • • •")
        text.setStroke('rgb(0,0,0)', 8);
        text.setOrigin(0, 0.5);
        text.setFontSize(24);

        var text2 = this.add.text(this.game.canvas.width * 0.75, this.game.canvas.height * 0.5 + 50, "Speed:   • •")
        text2.setStroke('rgb(0,0,0)', 8);
        text2.setOrigin(0, 0.5);
        text2.setFontSize(24);

        var text3 = this.add.text(this.game.canvas.width * 0.75, this.game.canvas.height * 0.5 + 100, "Special: • • •")
        text3.setStroke('rgb(0,0,0)', 8);
        text3.setOrigin(0, 0.5);
        text3.setFontSize(24);
        */

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

        var selectionChanged = false;

        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {
    
            var isLaunchGame = this.menuController.confirmSelection();
            if(isLaunchGame)
            {
                this.launchGame();
            }
        }
         
        if(Phaser.Input.Keyboard.JustDown(this.cursorUp)) {
            this.menuController.selectPreviousItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorDown)) {
            this.menuController.selectNextItem();
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {
            this.menuController.selectPreviousSubItem();
            //selectionChanged = true;
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.menuController.selectNextSubItem();
            //selectionChanged = true;
        }

        const pad = this.gamepad;
        const threshold = 0.25;
        if (pad != null && pad.axes.length)
        {
            pad.axes[0].threshold = 0.25;
            pad.axes[1].threshold = 0.25;

            var leftAxisX = pad.axes[0].getValue();
            var leftAxisY = pad.axes[1].getValue();

            //console.log(`(${(leftAxisX).toFixed(2)}, ${(leftAxisY).toFixed(2)}`);

        }

        /*
        if(Phaser.Input.Keyboard.JustDown(this.cursorLeft)) {  
            this.selectedVehicleIndex--;    
            selectionChanged = true;
        }
        else if(Phaser.Input.Keyboard.JustDown(this.cursorRight)) {
            this.selectedVehicleIndex++;
            selectionChanged = true;
        }
        */

        /*
        if(selectionChanged) {            
            if(this.selectedVehicleIndex < 0) this.selectedVehicleIndex = VehicleType.Hearse;
            if(this.selectedVehicleIndex > VehicleType.Hearse) this.selectedVehicleIndex = 0;

            this.infoText.setText(this.selectedVehicleIndex.toString());
    
            switch(this.selectedVehicleIndex) 
            {
                case VehicleType.Taxi:
                    this.selectedVehicleSprite.play('select-taxiYellow');
                    break;
                case VehicleType.Ambulance:
                    this.selectedVehicleSprite.play('select-vanWhite');
                    break;
                case VehicleType.RaceCar:
                    this.selectedVehicleSprite.play('select-raceCarBlue');
                    break;
                case VehicleType.PickupTruck:
                    this.selectedVehicleSprite.play('select-pickupTruckOrange');
                    break;
                case VehicleType.Hearse:
                    this.selectedVehicleSprite.play('select-hearseBlack');
                    break;
            }
        } 
        */      
    }

    launchGame(): void {                             
        var selectedVehicleTypeMenuItem = <ComplexMenuItem>this.menuController.selectedMenuPage.items[0];
        if(selectedVehicleTypeMenuItem.selectedSubItemIndex != null)
            this.sceneController.launchGame(selectedVehicleTypeMenuItem.selectedSubItemIndex);
        else
            this.sceneController.launchGame(VehicleType.Killdozer);
    }

    addGamepadListeners(): void {
        this.input.gamepad.once('connected', pad => {

            this.gamepad = pad;

            pad.on('down', (index, value, button) => {

                switch(index) {
                    case Constants.gamepadIndexSelect:
                        console.log('A');
                        var isLaunchGame = this.menuController.confirmSelection();
                        if(isLaunchGame)
                        {
                            this.launchGame();
                        }
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
                        this.menuController.selectPreviousSubItem();
                        console.log('Left');
                        break;
                    case Constants.gamepadIndexRight:
                        console.log('Right');
                        this.menuController.selectNextSubItem();
                        break;
                }                
            });
        });
    }
 }

 