import * as Phaser from 'phaser';

import { PlayerHUDOverlayComponent } from "./playerHUDOverlayComponent";
import { SceneController } from "./sceneController";
import { VehicleType } from '../gameobjects/player/player';
import { ComplexMenuItem, IconValueMapping, IconValueMappingWithStats, LocationOnMenuPage, MenuPage } from './menuPage';
import { MenuController } from './menuController';
import { Constants } from '../constants';
 
export class TitleScene extends Phaser.Scene {
    
    fpsText: Phaser.GameObjects.Text;

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

        this.load.atlasXML('orangeCars', './assets/vehicles/spritesheet-orangecars-all.png', './assets/vehicles/sprites-orangecars-all.xml');        
        this.load.atlasXML('whiteCars', './assets/vehicles/spritesheet-whitecars-all.png', './assets/vehicles/sprites-whitecars-all.xml');        
        this.load.atlasXML('yellowCars', './assets/vehicles/spritesheet-yellowcars-all.png', './assets/vehicles/sprites-yellowcars-all.xml');        
        this.load.atlasXML('blackCars', './assets/vehicles/spritesheet-blackcars-all.png', './assets/vehicles/sprites-blackcars-all.xml');        
        this.load.atlasXML('killdozer256', './assets/vehicles/sprites-killdozer.png', './assets/vehicles/sprites-killdozer.xml');        
        this.load.atlasXML('monstertruck256', './assets/vehicles/sprites-monstertruck256.png', './assets/vehicles/sprites-monstertruck256.xml');        
        this.load.atlasXML('police256', './assets/vehicles/spritesheet-police256.png', './assets/vehicles/sprites-police256.xml');        
        this.load.atlasXML('raceCar', './assets/vehicles/spritesheet-raceCar256.png', './assets/vehicles/sprites-raceCar256.xml');        
        this.load.atlasXML('ambulance256', './assets/vehicles/spritesheet-ambulance256.png', './assets/vehicles/sprites-ambulance256.xml');      
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
        });
        this.infoText.setOrigin(0.5, 0.5);        
        this.infoTextExpiryGameTime = this.game.getTime();

        var framerate = 10;

        var startIndex = 272;
        this.anims.create({
            key: 'select-raceCar',
            frames: [
                {key: 'raceCar', frame: 'raceCar-SW'},
                {key: 'raceCar', frame: 'raceCar-W-SW'},
                {key: 'raceCar', frame: 'raceCar-W'},
                {key: 'raceCar', frame: 'raceCar-W-NW'},
                {key: 'raceCar', frame: 'raceCar-NW'},
                {key: 'raceCar', frame: 'raceCar-N-NW'},
                {key: 'raceCar', frame: 'raceCar-N'},
                {key: 'raceCar', frame: 'raceCar-N-NE'},
                {key: 'raceCar', frame: 'raceCar-NE'},
                {key: 'raceCar', frame: 'raceCar-E-NE'},
                {key: 'raceCar', frame: 'raceCar-E'},
                {key: 'raceCar', frame: 'raceCar-E-SE'},
                {key: 'raceCar', frame: 'raceCar-SE'},
                {key: 'raceCar', frame: 'raceCar-S-SE'},
                {key: 'raceCar', frame: 'raceCar-S'},
                {key: 'raceCar', frame: 'raceCar-S-SW'}              
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        startIndex = 161;
        this.anims.create({
            key: 'select-pickupTruckOrange',
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
            key: 'select-vanWhite',
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
            key: 'select-taxiYellow',
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
            key: 'select-hearseBlack',
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
            key: 'select-killdozer',
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

        this.anims.create({
            key: 'select-police',//this.animPrefix + '-SSW',
            frames: [
                {key: 'police256', frame: 'police256-SW'},
                {key: 'police256', frame: 'police256-W-SW'},
                {key: 'police256', frame: 'police256-W'},
                {key: 'police256', frame: 'police256-W-NW'},
                {key: 'police256', frame: 'police256-NW'},
                {key: 'police256', frame: 'police256-N-NW'},
                {key: 'police256', frame: 'police256-N'},
                {key: 'police256', frame: 'police256-N-NE'},
                {key: 'police256', frame: 'police256-NE'},
                {key: 'police256', frame: 'police256-E-NE'},
                {key: 'police256', frame: 'police256-E'},
                {key: 'police256', frame: 'police256-E-SE'},
                {key: 'police256', frame: 'police256-SE'},
                {key: 'police256', frame: 'police256-S-SE'},
                {key: 'police256', frame: 'police256-S'},
                {key: 'police256', frame: 'police256-S-SW'}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        this.anims.create({
            key: 'select-ambulance',//this.animPrefix + '-SSW',
            frames: [
                {key: 'ambulance256', frame: 'ambulance-SW'},
                {key: 'ambulance256', frame: 'ambulance-W-SW'},
                {key: 'ambulance256', frame: 'ambulance-W'},
                {key: 'ambulance256', frame: 'ambulance-W-NW'},
                {key: 'ambulance256', frame: 'ambulance-NW'},
                {key: 'ambulance256', frame: 'ambulance-N-NW'},
                {key: 'ambulance256', frame: 'ambulance-N'},
                {key: 'ambulance256', frame: 'ambulance-N-NE'},
                {key: 'ambulance256', frame: 'ambulance-NE'},
                {key: 'ambulance256', frame: 'ambulance-E-NE'},
                {key: 'ambulance256', frame: 'ambulance-E'},
                {key: 'ambulance256', frame: 'ambulance-E-SE'},
                {key: 'ambulance256', frame: 'ambulance-SE'},
                {key: 'ambulance256', frame: 'ambulance-S-SE'},
                {key: 'ambulance256', frame: 'ambulance-S'},
                {key: 'ambulance256', frame: 'ambulance-S-SW'}
            ],
            frameRate: framerate,
            repeat: -1,            
        });

        this.menuController = new MenuController()
        
        var titleMenuPage = new MenuPage(this, false);        
        var mapSelectionMenuPage = new MenuPage(this, false);
        var vehicleSelectionMenuPage = new MenuPage(this, false);

        ///////////////////////////////////
        // title menu
        ///////////////////////////////////
        titleMenuPage.setTitle(this, "Vehicular Vengeance");
        titleMenuPage.setMarker(this, "•")
        titleMenuPage.setTitleIcon(this, 'carIcon', 'carIcon', 1);
        titleMenuPage.setFooter(this, "Copyright 2023 by Mark Dickinson")
        titleMenuPage.addStartGameMenuItem(this, "Instant Action");    
        titleMenuPage.addMenuLinkItem(this, "Single Player", mapSelectionMenuPage);
        titleMenuPage.addMenuLinkItem(this, "Multiplayer", mapSelectionMenuPage);
        titleMenuPage.addMenuLinkItem(this, "Options", mapSelectionMenuPage);

        ///////////////////////////////////
        // map selection menu  
        ///////////////////////////////////
        mapSelectionMenuPage.setTitle(this, "Select Map");
        mapSelectionMenuPage.setTitleIcon(this, 'shieldIcon', '', 1);
        mapSelectionMenuPage.setMarker(this, "•");

        var mapIcons = new Array<IconValueMapping>();
        mapIcons.push(new IconValueMapping({description: 'Forest', key: 'deathIcon', scale: 3, selectedIndex: 0}));
        mapIcons.push(new IconValueMapping({description: 'Quarry', key: 'shieldIcon', scale: 3, selectedIndex: 1}));
        mapIcons.push(new IconValueMapping({description: 'Desert', key: 'deathIcon', scale: 3, selectedIndex: 2}));
        mapSelectionMenuPage.addMenuComplexItemWithSprites(this, "Map", mapIcons, LocationOnMenuPage.CenterScreen);
        mapSelectionMenuPage.addMenuLinkItem(this, "Next", vehicleSelectionMenuPage);    
        mapSelectionMenuPage.setBackMenu(this, titleMenuPage);
             
        ///////////////////////////////////
        // vehicle selection menu
        ///////////////////////////////////
        vehicleSelectionMenuPage.setTitle(this, "Player 1: Select Vehicle");
        vehicleSelectionMenuPage.setTitleIcon(this, 'deathIcon', '', 1);
        vehicleSelectionMenuPage.setMarker(this, "•");        
        var vehicleSprites = new Array<IconValueMapping>();
        
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Taxi', key: 'select-taxiYellow', scale: 1.5, selectedIndex: VehicleType.Taxi, armorRating: 3, speedRating: 4, specialRating: 2, specialDescription: "Horn"}));
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Ambulance', key: 'select-ambulance', scale: 1.5, selectedIndex: VehicleType.Ambulance, armorRating: 3, speedRating: 2, specialRating: 3, specialDescription: "Siren"}));
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Speed Demon', key: 'select-raceCar', scale: 1, selectedIndex: VehicleType.RaceCar, armorRating: 2, speedRating: 5, specialRating: 2, specialDescription: "Buzzsaw"}));
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Guerilla', key: 'select-pickupTruckOrange', scale: 1.5, selectedIndex: VehicleType.PickupTruck, armorRating: 3, speedRating: 3, specialRating: 4, specialDescription: "Flamethrower"}));
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Hearse', key: 'select-hearseBlack', scale: 1.5, selectedIndex: VehicleType.Hearse, armorRating: 4, speedRating: 2, specialRating: 2, specialDescription: "EMP"}));                
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Killdozer', key: 'select-killdozer', scale: 1.5, selectedIndex: VehicleType.Killdozer, armorRating: 5, speedRating: 1, specialRating: 4, specialDescription: "Slamtime"}));                
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Monster Truck', key: 'select-monstertruck', scale: 1.5, selectedIndex: VehicleType.MonsterTruck, armorRating: 5, speedRating: 3, specialRating: 2, specialDescription: "Slamtime"}));                
        vehicleSprites.push(new IconValueMappingWithStats({description: 'Police', key: 'select-police', scale: 1, selectedIndex: VehicleType.Police, armorRating: 3, speedRating: 4, specialRating: 3, specialDescription: "Zapper"}));                
        
        var complexMenuItem = vehicleSelectionMenuPage.addMenuComplexItemWithSprites(this, "Vehicle", vehicleSprites, LocationOnMenuPage.CenterScreen);        
        vehicleSelectionMenuPage.setInitialStats(this, complexMenuItem);
        vehicleSelectionMenuPage.addMenuComplexItemWithSprites(this, "Team",
            [
                new IconValueMapping({description:'Red', key: 'deathIcon', scale: 0.5, color: 0xFF0000, selectedIndex: 0}),
                new IconValueMapping({description:'Blue', key: 'shieldIcon', scale: 0.5, color: 0x0000FF, selectedIndex: 1})
            ],
            LocationOnMenuPage.NextToMenuItem);

        vehicleSelectionMenuPage.addStartGameMenuItem(this, "Confirm Selection");   
        vehicleSelectionMenuPage.setBackMenu(this, mapSelectionMenuPage); 
        
        // adding menus to menu controller in order        
        this.menuController.addMenu(titleMenuPage);
        this.menuController.addMenu(mapSelectionMenuPage);
        this.menuController.addMenu(vehicleSelectionMenuPage);

        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    
    update(): void {

        var selectionChanged = false;

        if(Phaser.Input.Keyboard.JustDown(this.selectKey)) {
    
            var isLaunchGame = this.menuController.confirmSelection();
            if(isLaunchGame)
            {
                this.launchGame();
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
                    case Constants.gamepadIndexBack:
                        console.log('B');
                        this.menuController.returnToLastScreen();
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
        });
    }
 }

 