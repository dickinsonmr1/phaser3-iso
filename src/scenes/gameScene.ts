import * as Phaser from 'phaser';
import { Constants } from "../constants";
import { Pickup, PickupType } from "../gameobjects/pickup";
import { Player, PlayerDrawOrientation, VehicleType } from "../gameobjects/player/player";
import { Projectile } from "../gameobjects/projectile";
import { Point, Utility } from "../utility";
import { SceneController } from "./sceneController";
import { RaceCarPlayer } from '../gameobjects/player/racecarplayer';
import { VehicleFactory } from '../gameobjects/player/vehicleFactory';

export default class GameScene extends Phaser.Scene
{    
    sceneController: SceneController;

    //playerSpeed: number = 0.25;
    player: Player;
    player2: Player;
    player3: Player;
    player4: Player;

    allPlayers: Phaser.GameObjects.Group;
    allBullets: Phaser.GameObjects.Group;

    public showDebug: boolean = false;

    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;
    toggleDebugKey: Phaser.Input.Keyboard.Key;

    moveUpKey: Phaser.Input.Keyboard.Key;
    moveDownKey: Phaser.Input.Keyboard.Key;
    moveLeftKey: Phaser.Input.Keyboard.Key;
    moveRightKey: Phaser.Input.Keyboard.Key;

    firePrimaryWeaponKey: Phaser.Input.Keyboard.Key;
    fireSecondaryWeaponKey: Phaser.Input.Keyboard.Key;
    
    gamepad: Phaser.Input.Gamepad.Gamepad;
    mostRecentCartesianGamepadAxes: Phaser.Geom.Point = new Phaser.Geom.Point(0,0);

    light: any;

    layer1 : Phaser.Tilemaps.TilemapLayer;
    layer2 : Phaser.Tilemaps.TilemapLayer;
    layer3 : Phaser.Tilemaps.TilemapLayer;
    layer4 : Phaser.Tilemaps.TilemapLayer;
    layer5 : Phaser.Tilemaps.TilemapLayer;
    layerPickups : Phaser.Tilemaps.TilemapLayer;
    layerRespawnPoints : Phaser.Tilemaps.TilemapLayer;

    pickups : Array<Phaser.GameObjects.GameObject> = new Array<Phaser.GameObjects.GameObject>();
    //pickupIcons : Array<Phaser.GameObjects.GameObject> = new Array<Phaser.GameObjects.GameObject>();

    pickupObjects : Array<Pickup> = new Array<Pickup>();
    pickupPhysicsObjects: Phaser.GameObjects.Group;

    respawnPoints : Array<Point> = new Array<Point>();

    environmentDestructiblePhysicsObjects: Phaser.GameObjects.Group;
    environmentIndestructiblePhysicsObjects: Phaser.GameObjects.Group;
    
    
    pickupScaleTime: number = 60;
    pickupScale: number = 1;

    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    debugGraphics: Phaser.GameObjects.Graphics;

    player1VehicleType: VehicleType;

    crosshairSprite: Phaser.GameObjects.Sprite;


    constructor (sceneController: SceneController, player1VehicleType: VehicleType)
    {
        super('GameScene');

        this.sceneController = sceneController;

        this.player1VehicleType = player1VehicleType;

        this.gamepad = null;
    }

    preload ()
    {
        this.load.atlasXML('hudSprites', './assets/sprites/HUD/spritesheet_hud.png', './assets/sprites/HUD/spritesheet_hud.xml');        
        this.load.atlasXML('uiSpaceSprites', './assets/sprites/HUD/uipackSpace_sheet.png', './assets/sprites/HUD/uipackSpace_sheet.xml');        
        this.load.atlasXML('redUISprites', './assets/sprites/HUD/redSheet.png', './assets/sprites/HUD/redSheet.xml');        
        this.load.atlasXML('greyUISprites', './assets/sprites/HUD/greySheet.png', './assets/sprites/HUD/greySheet.xml');        
        //this.load.image('weaponIconLaserPistol', './assets/sprites/player/raygun.png');
        //this.load.image('weaponIconLaserRepeater', './assets/sprites/player/raygunBig.png');
        //this.load.image('weaponIconPulseCharge', './assets/sprites/player/raygunPurple.png');
        //this.load.image('weaponIconRocketLauncher', './assets/sprites/player/raygunPurpleBig.png');

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
        this.load.image('deathIcon', './assets/sprites/HUD/skull.png');
        this.load.image('rocketIcon', './assets/sprites/HUD/chess_pawn.png');
        this.load.image('fireIcon', './assets/sprites/HUD/fire.png');
        this.load.image('specialIcon', './assets/sprites/HUD/specialIcon.png');
        //
        this.load.image('playerGunLaser1', './assets/sprites/weapons/laserPurpleDot15x15.png');
        this.load.image('rocket', './assets/sprites/weapons/rocket_2_small_down_square.png');
        this.load.image('bullet', './assets/sprites/weapons/bulletSand1.png');

        // tiles
        //this.load.image('tiles', './assets/iso-64x64-outside.png');
        this.load.image('tiles2', './assets/iso-64x64-building.png');
        this.load.image('groundTiles', './assets/Overworld - Terrain 1 - Flat 128x64.png');
        this.load.image('waterTiles', './assets/Overworld - Water - Flat 128x64.png');
        //this.load.image('crateTilesWood', './assets/crates - wood 64x64.png');
        this.load.image('crateTilesMetal', './assets/Crates - Metal 64x64.png');
        this.load.image('roadTiles', './assets/Road_Toon_01-128x64.png');        
        this.load.image('outlineTile', './assets/Grid Type A - 128x64.png');   
        this.load.image('treeTile', './assets/baum-tree.png');   
        this.load.image('houseTile', './assets/house-sample.png');   
        this.load.image('buildingTile', './assets/building-sample-256x256.png');         

        this.load.tilemapTiledJSON('map', './assets/isoRoads.json');
        this.load.atlasXML('utilityCars', './assets/vehicles/sheet_utility.png', './assets/vehicles/sheet_utility.xml');        

        this.load.atlasXML('blueCars', './assets/vehicles/spritesheet-bluecars-all.png', './assets/vehicles/sprites-bluecars-all.xml');        
        this.load.atlasXML('orangeCars', './assets/vehicles/spritesheet-orangecars-all.png', './assets/vehicles/sprites-orangecars-all.xml');        
        this.load.atlasXML('whiteCars', './assets/vehicles/spritesheet-whitecars-all.png', './assets/vehicles/sprites-whitecars-all.xml');        
        this.load.atlasXML('yellowCars', './assets/vehicles/spritesheet-yellowcars-all.png', './assets/vehicles/sprites-yellowcars-all.xml');        
        this.load.atlasXML('blackCars', './assets/vehicles/spritesheet-blackcars-all.png', './assets/vehicles/sprites-blackcars-all.xml');        

        this.load.image('explosion', './assets/sprites/explosions/tank_explosion3.png');
        this.load.image('smoke', './assets/sprites/explosions/tank_explosion9.png');
        this.load.image('sparks', './assets/sprites/explosions/tank_explosion5.png');
        this.load.image('shockwave', './assets/sprites/explosions/tank_explosion1.png');

        this.load.image('crosshair', './assets/sprites/crosshair061.png');
        //this.load.atlasXML('tanksSpritesheet', './assets/sprites/weapons/tanks_spritesheetDefault.png', './assets/sprites/weapons/tanks_spritesheetDefault.xml');
    }

    create ()
    {
        //this.physics.world.setBounds(-200, -200, 400, 400);

        this.debugGraphics = this.add.graphics();
        this.debugGraphics.setScale(2);

        var map = this.add.tilemap('map');
        // https://labs.phaser.io/edit.html?src=src/tilemap/debug%20colliding%20tiles.js

        console.log(map);

        //var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
        //v
        //var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2')

        // tileset name matches what is in Tiled
        var tilesetGround = map.addTilesetImage('Overworld - Terrain 1 - Flat 128x64', 'groundTiles');      
        var tilesetWater = map.addTilesetImage('Overworld - Water - Flat 128x64', 'waterTiles');
        var tilesetRoads = map.addTilesetImage('Road_Toon_01-128x64', 'roadTiles');
        var tilesetPickups = map.addTilesetImage('Grid Type A - 128x64', 'outlineTile');
        var tilesetObjects = map.addTilesetImage('baum-tree', 'treeTile');       
        var tilesetHouses = map.addTilesetImage('house-sample', 'houseTile');
        var tilesetBuildings = map.addTilesetImage('building-sample-256x256', 'buildingTile');
        //var tilesetObjects = map.addTilesetImage('baum-tree', 'treeTile', 'houseTile', 'tiles2');

        // https://www.phaser.io/examples/v3/view/game-objects/lights/tilemap-layer
        this.layer1 = map.createLayer('GroundLayer', [ tilesetGround, tilesetWater ])
            .setDisplayOrigin(0.5, 0.5)              
            .setPipeline('Light2D');

        this.layer2 = map.createLayer('WaterLayer', [ tilesetWater ])
            .setDisplayOrigin(0.5, 0.5)    
            .setPipeline('Light2D')
            .setAlpha(0.8);
                        
        this.layer3 = map.createLayer('RoadsLayer', [ tilesetRoads ])
            .setDisplayOrigin(0.5, 0.5)    
            .setPipeline('Light2D');

        this.layerPickups = map.createLayer('PickupsLayer', [ tilesetPickups ])
            .setDisplayOrigin(0.5, 0.5)
            .setPipeline('Light2D');

        this.layer4 = map.createLayer('ObjectsLayer', [ tilesetObjects, tilesetHouses, tilesetBuildings ])
            .setDisplayOrigin(0.5, 0.5)
            .setPipeline('Light2D');

        this.layerRespawnPoints = map.createLayer('RespawnPointLayer', [ tilesetPickups ])
            .setDisplayOrigin(0.5, 0.5);

        //this.layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
        //this.layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
        //this.layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
        //this.layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);


        //let colorIndex = 0;
        //const spectrum = Phaser.Display.Color.ColorSpectrum(128);

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);
        this.light = this.lights.addLight(0, 0, 100).setIntensity(3);
    

        //this.light.setVisible(false);
        //var color = spectrum[colorIndex];

        //this.light.color.setTo(color.r, color.g, color.b);
        /*
        var tileset = map.addTilesetImage('tiles3', null, 32, 32, 1, 2);
        var layer = map.createLayer(0, tileset, 0, 0).setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);
    
        this.light = this.lights.addLight(0, 0, 200);
    
        this.lights.addLight(0, 100, 140).setColor(0xff0000).setIntensity(3.0);
        this.lights.addLight(0, 250, 140).setColor(0x00ff00).setIntensity(3.0);
        this.lights.addLight(0, 400, 140).setColor(0xff00ff).setIntensity(3.0);
        this.lights.addLight(0, 550, 140).setColor(0xffff00).setIntensity(3.0);
        */
        //player = this.add.sprite(100, 100, 'utilityCars', 'police_W.png');

        var vehicleFactory = new VehicleFactory();

        this.player = vehicleFactory.generatePlayer(this.player1VehicleType, false, this);
        this.player.init();   
        
        //this.crosshairSprite = this.add.sprite(this.player.x, this.player.y, 'crosshair');
        //this.crosshairSprite.setOrigin(0.5, 0.5);
        //this.crosshairSprite.setAngle(45);
        //this.crosshairSprite.setScale(0.5, 0.3);        
        //this.crosshairSprite.play(key);
        
        this.player2 = vehicleFactory.generatePlayer(VehicleType.PickupTruck, true, this);
        this.player2.init();

        this.player3 = vehicleFactory.generatePlayer(VehicleType.Ambulance, true, this);
        this.player3.init();

        this.player4 = vehicleFactory.generatePlayer(VehicleType.Taxi, true, this);
        this.player4.init();

        this.allPlayers = this.physics.add.group();

        this.allPlayers.add(this.player);
        this.allPlayers.add(this.player2);
        this.allPlayers.add(this.player3);
        this.allPlayers.add(this.player4);

        var cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setZoom(2);

        /*
        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.0005,
            maxSpeed: 0.7
        };
        */

        //this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        
        this.particleEmitter = this.add.particles(0, 0, 'explosion', {
            x: 0,
            y: 0,
            lifespan: 750,
            speed: { min: -50, max: 50 },
            //tint: 0xff0000, 
            scale: {start: 0.5, end: 1.0},
            blendMode: 'ADD',
            frequency: -1,
            alpha: {start: 0.9, end: 0.0},
        });

        this.physics.add.overlap(this.player, this.layerPickups);
        this.layerPickups.setTileIndexCallback(Constants.pickupSpawnTile, this.playerTouchingTileHandler, this);

        this.pickupPhysicsObjects = this.physics.add.group();
        this.layerPickups.forEachTile(tile => {
            this.generatePickup(tile);            
        })    
        
        this.layerRespawnPoints.forEachTile(tile => {
            this.generateRespawnPoint(tile);            
        })        
        
        this.environmentDestructiblePhysicsObjects = this.physics.add.group();
        this.environmentIndestructiblePhysicsObjects = this.physics.add.group();

        this.layer4.forEachTile(tile => {

            if(tile.index == Constants.houseObjectTile)
                this.generateDestructibleObject(tile, 'houseTile'); 
            if(tile.index == Constants.treeObjectTile)
                this.generateDestructibleObject(tile, 'treeTile');
            if(tile.index == Constants.buildingObjectTile)
                this.generateBuilding(tile);
        });        

        this.physics.add.overlap(this.allPlayers, this.layer4);
        
        /*this.physics.add.overlap(this.player, this.layer4);
        this.physics.add.overlap(this.player2, this.layer4);
        this.physics.add.overlap(this.player3, this.layer4);
        this.physics.add.overlap(this.player4, this.layer4);
        */

        //this.layer4.setTileIndexCallback(Constants.treeObjectTile, this.playerOrWeaponTouchingObjectTileHandler, this);
        //this.layer4.setTileIndexCallback(Constants.houseObjectTile, this.playerOrWeaponTouchingObjectTileHandler, this);

        this.allBullets = this.physics.add.group();
        /*
        this.allBullets.addMultiple(this.player.bullets.getChildren());
        this.allBullets.addMultiple(this.player2.bullets.getChildren());
        this.allBullets.addMultiple(this.player3.bullets.getChildren());
        this.allBullets.addMultiple(this.player4.bullets.getChildren());
        */

        this.physics.add.overlap(this.allPlayers, this.environmentDestructiblePhysicsObjects, (player, object) => this.playerOrWeaponTouchingEnvironmentObject(player, object));
        //this.physics.add.overlap(this.allBullets, this.environmentPhysicsObjects, (bullets, object) => this.playerOrWeaponTouchingEnvironmentObject(bullets, object));

        this.physics.add.overlap(this.player.bullets, this.environmentDestructiblePhysicsObjects, (bullets, object) => this.playerOrWeaponTouchingEnvironmentObject(bullets, object));
        this.physics.add.overlap(this.player2.bullets, this.environmentDestructiblePhysicsObjects, (bullets, object) => this.playerOrWeaponTouchingEnvironmentObject(bullets, object));
        this.physics.add.overlap(this.player3.bullets, this.environmentDestructiblePhysicsObjects, (bullets, object) => this.playerOrWeaponTouchingEnvironmentObject(bullets, object));
        this.physics.add.overlap(this.player4.bullets, this.environmentDestructiblePhysicsObjects, (bullets, object) => this.playerOrWeaponTouchingEnvironmentObject(bullets, object));

        //this.physics.add.collider(this.player, this.environmentIndestructiblePhysicsObjects);
        //this.physics.world.collide(this.player, this.environmentIndestructiblePhysicsObjects);
        
        //this.physics.add.overlap(this.player.bullets, this.layer4);
        //this.physics.add.overlap(this.player2.bullets, this.layer4);
        //this.physics.add.overlap(this.player3.bullets, this.layer4);
        //this.physics.add.overlap(this.player4.bullets, this.layer4);

        //const particles = this.player.particleEmitterFlamethrower.overlap(this.player2);
        this.physics.add.overlap(this.player.particleEmitterFlamethrower, this.player2, (player, flame) => this.flameTouchingPlayerHandler(player, flame));
        this.physics.add.overlap(this.player.particleEmitterFlamethrower, this.player3, (player, flame) => this.flameTouchingPlayerHandler(player, flame));
        this.physics.add.overlap(this.player.particleEmitterFlamethrower, this.player4, (player, flame) => this.flameTouchingPlayerHandler(player, flame));

        this.layer4.setTileIndexCallback(Constants.treeObjectTile, this.playerOrWeaponTouchingObjectTileHandler, this);

        
        //this.layer2.setCollisionByExclusion([-1],true);//, Constants.tileLockBlue]);
        //this.layer2.setTileIndexCallback(35, this.playerTouchingTileHandler2, this);

        this.physics.add.collider(this.allPlayers, this.allPlayers);

        this.physics.add.overlap(this.player2, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));
        this.physics.add.overlap(this.player3, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));
        this.physics.add.overlap(this.player4, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));

        this.physics.add.overlap(this.player, this.player2.bullets, (player, bullet) => this.bulletTouchingEnemyHandler(player, bullet));
        this.physics.add.overlap(this.player, this.player3.bullets, (player, bullet) => this.bulletTouchingEnemyHandler(player, bullet));
        this.physics.add.overlap(this.player, this.player4.bullets, (player, bullet) => this.bulletTouchingEnemyHandler(player, bullet));

        

        this.physics.add.overlap(this.allPlayers, this.pickupPhysicsObjects, (player, pickup) => this.playerTouchingPickup(player, pickup));
        //this.physics.add.overlap(this.player2, this.pickupPhysicsObjects, (player, pickup) => this.playerTouchingPickup(player, pickup));
        //this.physics.add.overlap(this.player3, this.pickupPhysicsObjects, (player, pickup) => this.playerTouchingPickup(player, pickup));
        //this.physics.add.overlap(this.player4, this.pickupPhysicsObjects, (player, pickup) => this.playerTouchingPickup(player, pickup));

        this.cameras.main.startFollow(this.player, true, 0.6, 0.6, 0, 0);

        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.toggleDebugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK);

        this.moveUpKey = cursors.up;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.moveDownKey = cursors.down; //this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.moveRightKey = cursors.right;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.moveLeftKey = cursors.left;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.firePrimaryWeaponKey = cursors.space;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.fireSecondaryWeaponKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.addGamePadListeners();   
        
        this.debugGraphics.clear();

        var showTiles = true;
        var showCollidingTiles = true;
        var showFaces = true;

        const tileColor = showTiles ? new Phaser.Display.Color(105, 210, 231, 200) : null;
        const colldingTileColor = showCollidingTiles ? new Phaser.Display.Color(243, 134, 48, 200) : null;
        const faceColor = showFaces ? new Phaser.Display.Color(40, 39, 37, 255) : null;

        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(this.debugGraphics, {
            tileColor: tileColor, // Non-colliding tiles
            collidingTileColor: colldingTileColor, // Colliding tiles
            faceColor: faceColor // Interesting faces, i.e. colliding edges
        });

        //this.cameras.main.postFX.addTiltShift(0.5, 0.1, 0.8, 0.5, 1, 1);
    }

    generatePickup(tile) {
        if(tile.index == Constants.pickupSpawnTile) {
            const x = ((tile.x * tile.width)) / 2 + tile.width / 2; //tile.x;// tile.getCenterX();
            const y = ((tile.y * tile.height));// / 2 + tile.height / 2; //tile.y;//tile.getCenterY();                
           
            var temp = Utility.cartesianToIsometric(new Point(x, y));

            var topColor = 0;
            var leftColor = 0;
            var rightColor = 0;

            var pickupType = PickupType.Rocket;
            var rand = Utility.getRandomInt(7);
            var pickUpIconKey = "shieldIcon";
            switch(rand) {
                case 0: // pink
                    topColor = 0xFF6FCC;
                    leftColor = 0xFF2DB6;
                    rightColor = 0xFF5BC6;
                    pickupType = PickupType.Rocket;
                    pickUpIconKey = "rocketIcon";
                    break;
                case 1: // purple
                    topColor = 0xA26FFF;
                    leftColor = 0x762DFF;
                    rightColor = 0x945BFF;
                    pickupType = PickupType.Rocket;
                    pickUpIconKey = "rocketIcon";
                    break;
                case 2: // green
                    topColor = 0xB4FF6F;
                    leftColor = 0x93FF2D;
                    rightColor = 0xABFF5B;
                    pickupType = PickupType.Special;
                    pickUpIconKey = "specialIcon";
                    break;
                case 3: // blue
                    topColor = 0x6F84FF;
                    leftColor = 0x2D4DFF;
                    rightColor = 0x5B74FF;
                    pickupType = PickupType.Shield;
                    pickUpIconKey = "shieldIcon";
                    break;
                case 4: // yellow
                    topColor = 0xFFEA6F;
                    leftColor = 0xFFEA6F;
                    rightColor = 0xFFE65B;
                    pickupType = PickupType.Turbo;
                    pickUpIconKey = "turboIcon";
                    break;
                case 5: // red
                    topColor = 0xFF726F;
                    leftColor = 0xFF302D;
                    rightColor = 0xFF5D5B;
                    pickupType = PickupType.Health;
                    pickUpIconKey = "healthIcon";
                    break;
                case 6: // orange
                    topColor = 0xFFBA6F;
                    leftColor = 0xFF992D;
                    rightColor = 0xFFAF5B;
                    pickupType = PickupType.Flamethrower;
                    pickUpIconKey = "fireIcon";
                    break;
                default: // pink
                    topColor = 0xFF6FCC;
                    leftColor = 0xFF2DB6;
                    rightColor = 0xFF5BC6;
                    pickupType = PickupType.Flamethrower;
                    pickUpIconKey = "fireIcon";
                    break;
            }

            var pickup = new Pickup({
                scene: this,
                pickupType: pickupType,
                x: temp.x,
                y: temp.y,
                size: 20,
                height: 10,
                topColor: topColor,
                leftColor: leftColor,
                rightColor: rightColor,
                pickupIconKey: pickUpIconKey
                //name: pickupType.toString(),
                //depth: 2,
                //alpha: 0.5
            });

            this.pickupObjects.push(pickup);
            
            /*
            var pickup = this.add.isobox(temp.x, temp.y, 30, 15, topColor, leftColor, rightColor);
            pickup.name = pickupType.toString();        
            pickup.depth = 2;
            pickup.alpha = 0.5;
            pickup.setOrigin(0.5, 0.5);
            this.physics.world.enable(pickup);

            this.pickups.push(pickup);

            var pickupIcon = this.add.image(
                temp.x,
                temp.y,
                pickUpIconKey);
            pickupIcon.setScale(0.25);
            pickupIcon.setOrigin(0.5, 0.85);
                //this.deathIcon.setDisplayOrigin(0,0);
            pickupIcon.alpha = 1.0;//0.2;    
            pickupIcon.depth = 1;

            this.pickupIcons.push(pickupIcon);
            */

            this.layerPickups.removeTileAt(tile.x, tile.y);
        }
    }

    generateRespawnPoint(tile) {
        if(tile.index == Constants.pickupSpawnTile) {
            const x = ((tile.x * tile.width)) / 2 + tile.width / 2; //tile.x;// tile.getCenterX();
            const y = ((tile.y * tile.height));// / 2 + tile.height / 2; //tile.y;//tile.getCenterY();                
           
            var temp = Utility.cartesianToIsometric(new Point(x, y));

            this.respawnPoints.push(new Point(temp.x, temp.y));

            this.layerRespawnPoints.removeTileAt(tile.x, tile.y);
        }
    }

    getRandomRespawnPoint(): Point {
        let randomIndex = Utility.getRandomInt(this.respawnPoints.length - 1);
        return this.respawnPoints[randomIndex];
    }

    generateDestructibleObject(tile, tileName) {
        const x = ((tile.x * tile.width)) / 2 + tile.width / 2; //tile.x;// tile.getCenterX();
        const y = ((tile.y * tile.height));// tile.height / 2; //tile.y;//tile.getCenterY();                
        
        var temp = Utility.cartesianToIsometric(new Point(x, y));

        var sprite =  this.physics.add.image(temp.x, temp.y, tileName);
        sprite.setOrigin(0.5, 0.5);
        //sprite.setScale(0.75, 0.75);            
        sprite.setDepth(temp.y + 64);            
        sprite.setBodySize(50, 15, true);

        this.environmentDestructiblePhysicsObjects.add(sprite);

        this.layer4.removeTileAt(tile.x, tile.y);
    }

    generateBuilding(tile) {
        const x = ((tile.x * 128)) / 2 + 128 / 2; //tile.x;// tile.getCenterX();
        const y = ((tile.y * 64));// tile.height / 2; //tile.y;//tile.getCenterY();                
        
        var temp = Utility.cartesianToIsometric(new Point(x, y));

        var sprite =  this.physics.add.staticImage(temp.x, temp.y, 'buildingTile');
        sprite.setOrigin(0.5, 0);
        //sprite.setScale(0.75, 0.75);            
        sprite.setDepth(temp.y + 256);            
        sprite.setBodySize(220, 25, true);
        
        //this.environmentIndestructiblePhysicsObjects.add(sprite);

        this.layer4.removeTileAt(tile.x, tile.y);
    }

    addGamePadListeners() {
        if (this.input.gamepad.total === 0)
        {
            this.input.gamepad.once('connected', pad => {
        
            //if(this.input.gamepad.pad1 != null) {
                //this.gamepad = this.input.gamepad.pad1;

                this.gamepad = pad;
                pad.on('down', (index, value, button) => {

                    switch(index) {
                        case Constants.gamepadIndexJump:
                            console.log('A');
                            //this.tryJump(scene.sound);
                            break;
                        case Constants.gamepadIndexInteract:
                            console.log('X');
                            //this.tryInteract();
                            break;
                        case Constants.gamepadIndexPause:
                            //scene.sceneController.pauseGame();
                            break;
                        case Constants.gamepadIndexUp:
                            console.log('Up');
                            //this.tryJump(scene.sound);
                            break;
                        case Constants.gamepadIndexDown:
                            console.log('Down');
                            //this.duck();
                            break;
                        case Constants.gamepadIndexLeft:
                            console.log('Left');
                            //this.moveX(-1);
                            break;
                        case Constants.gamepadIndexRight:
                            console.log('Right');
                            //this.moveX(1);
                            break;                    
                        case Constants.gamepadIndexShoot:
                            console.log('B');
                            //this.player.tryFireBullet(this.sys.game.loop.time, this.sound);
                    }
                });
            });
        }           
        else
        {
            this.gamepad = this.input.gamepad.pad1;
        }
    }

    playerTouchingTileHandler(sprite, tile): boolean {
        let scene = <GameScene>this;//.scene;
        scene.layerPickups.removeTileAt(tile.x, tile.y);

        return true;
    }  

    playerOrWeaponTouchingObjectTileHandler(sprite, tile): boolean {
        let scene = <GameScene>this;

        var point = scene.layer3.tileToWorldXY(tile.x + 1, tile.y);
        this.particleEmitter.explode(2, point.x, point.y);

        scene.layer4.removeTileAt(tile.x, tile.y);   

        if(sprite instanceof Projectile)
        {
            var projectile = <Projectile>sprite;
            projectile.remove();
        }
                
        return true;
    }  


    bulletTouchingEnemyHandler(enemy: any, bullet: any): void {       

        var otherPlayer = <Player>enemy;
        var projectile = <Projectile>bullet;
        
        if(otherPlayer.deadUntilRespawnTime <= 0) {
            otherPlayer.tryDamage(projectile.projectileType);
            bullet.remove();
        }
        /*         
        var scene = <MainScene>enemy.getScene();
        scene.weaponHitParticleEmitter.explode(10, enemy.x, enemy.y);
              
        var damage = bullet.damage;
        scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

        enemy.tryDamage(damage);
        scene.player.score += damage;

        scene.sound.play("enemyHurtSound");
        
        if(this.isMultiplayer) {
            var socket = scene.getSocket();        
            if(socket != null) {
                // sends back to server
                socket.emit('bulletDestruction', {bulletId: bullet.bulletId});                
            }
        }

        bullet.destroy();
        */
    }

    flameTouchingPlayerHandler(enemy: any, flame: any): void {       

        var otherPlayer = <Player>enemy;
        
        if(otherPlayer.deadUntilRespawnTime <= 0) {
            otherPlayer.tryDamageWithFlames(0.01);
            //bullet.remove();
        }
    }
    
    playerTouchingPickup(player: any, pickup: any): void {       

        var selectedPlayer = <Player>player;
        var selectedPickup = <Phaser.GameObjects.IsoBox>pickup;
        //var pickupNumber = Number(pickup.name);

        var pickupType = Number(selectedPickup.getData('PickupType'));

        switch(pickupType){
            case PickupType.Turbo:
                console.log('refill turbo');
                this.sceneController.hudScene.setInfoText("Turbo refilled - " + selectedPlayer.playerId, 2000);
                selectedPlayer.refillTurbo();
                break;
            case PickupType.Rocket:
                console.log('refill rockets');
                this.sceneController.hudScene.setInfoText("Rockets acquired - " + selectedPlayer.playerId, 2000);
                break;
            case PickupType.Bullet:
                console.log('refill bullets');
                this.sceneController.hudScene.setInfoText("Bullets acquired - " + selectedPlayer.playerId, 2000);
                break;
            case PickupType.Health:
                console.log('refill health');
                this.sceneController.hudScene.setInfoText("Health restored - " + selectedPlayer.playerId, 2000);
                selectedPlayer.refillHealth();
                break;
            case PickupType.Special:
                console.log('refill special');
                this.sceneController.hudScene.setInfoText("Special restored - " + selectedPlayer.playerId, 2000);
                break;
            case PickupType.Flamethrower:
                console.log('refill flamethrower');
                this.sceneController.hudScene.setInfoText("Flamethrower restored - " + selectedPlayer.playerId, 2000);
                break;
            case PickupType.Shield:
                console.log('refill shield');
                this.sceneController.hudScene.setInfoText("Shield restored - " + selectedPlayer.playerId, 2000);
                break;
        }
        
        //selectedPlayer.
        //otherPlayer.tryDamage();
        pickup.destroy();

        //var pickupParent = pickup.getData('parentId');
        
        
        //bullet.remove();
        /*         
        var scene = <MainScene>enemy.getScene();
        scene.weaponHitParticleEmitter.explode(10, enemy.x, enemy.y);
              
        var damage = bullet.damage;
        scene.addExpiringText(scene, enemy.x, enemy.y, damage.toString())

        enemy.tryDamage(damage);
        scene.player.score += damage;

        scene.sound.play("enemyHurtSound");
        
        if(this.isMultiplayer) {
            var socket = scene.getSocket();        
            if(socket != null) {
                // sends back to server
                socket.emit('bulletDestruction', {bulletId: bullet.bulletId});                
            }
        }

        bullet.destroy();
        */
    }

    playerOrWeaponTouchingEnvironmentObject(playerOrWeapon: any, object: any) {

        this.particleEmitter.explode(2, object.x, object.y);

        
        if(playerOrWeapon instanceof Projectile)
        {
            var projectile = <Projectile>playerOrWeapon;
            projectile.remove();
        }

        object.destroy();
    }

    update(time, delta) {
        //player.y -= 1;
        //this.controls.update(delta);

        this.events.emit('updateFPS', delta);

        if(this.zoomInKey.isDown)
            this.cameras.main.zoom -= 0.01;  

        if(this.zoomOutKey.isDown)
            this.cameras.main.zoom += 0.01;  
       
        var body = <Phaser.Physics.Arcade.Body>this.player.body;

        const pad = this.gamepad;
        const threshold = 0.25;
        if (pad != null && pad.axes.length)
        {
            pad.axes[0].threshold = 0.25;
            pad.axes[1].threshold = 0.25;

            var leftAxisX = pad.axes[0].getValue();
            var leftAxisY = pad.axes[1].getValue();

            //console.log(`(${(leftAxisX).toFixed(2)}, ${(leftAxisY).toFixed(2)}`);

            if(pad.L2) {
                this.player.tryTurboBoostOn();
            }
            else {
                this.player.tryTurboBoostOff();
            }

            if(leftAxisX != 0 || leftAxisY != 0) {

                this.mostRecentCartesianGamepadAxes = Utility.isometricToCartesian(new Phaser.Geom.Point(leftAxisX, leftAxisY));

                this.player.tryMoveWithGamepad(this.mostRecentCartesianGamepadAxes.x, this.mostRecentCartesianGamepadAxes.y);
            }
            else {
                this.player.tryStopMove();                
            }                    

            if(pad.R2) {
                this.player.tryFirePrimaryWeaponWithGamepad();//this.mostRecentCartesianGamepadAxes.x, this.mostRecentCartesianGamepadAxes.y);
                //this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            } 

            if(pad.X) {
                this.player.tryFireFlamethrower();//this.mostRecentCartesianGamepadAxes.x, this.mostRecentCartesianGamepadAxes.y);
                //this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            } 
            else{
                this.player.tryStopFireFlamethrower();
            }
            
            if(pad.B) {
                this.player.tryFireSecondaryWeaponWithGamepad();//this.mostRecentCartesianGamepadAxes.x, this.mostRecentCartesianGamepadAxes.y);
                //this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            }  

            if(pad.A) {
                this.player.tryFireShockwave();
            } 

            if(pad.Y) {
                this.player.tryFireAirstrike();
            } 
            
            if(pad.L1)
                this.cameras.main.zoom -= 0.01;

            if(pad.R1)
                this.cameras.main.zoom += 0.01;

                /*
            if(pad.Y) {
                this.showDebug = !this.showDebug;
                if(this.showDebug) {
                    this.player.showDebugText();
                    this.player2.showDebugText();
                    this.player3.showDebugText();
                    this.player4.showDebugText();
                }
                if(!this.showDebug) {
                    this.player.hideDebugText();
                    this.player2.hideDebugText();
                    this.player3.hideDebugText();
                    this.player4.hideDebugText();
                }
            }
            */
        }
        if(pad == null) {

            if(this.moveUpKey.isDown && !this.moveLeftKey.isDown && !this.moveRightKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.N);
            }
            else if(this.moveDownKey.isDown && !this.moveLeftKey.isDown && !this.moveRightKey.isDown) {            
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.S);
            }
            else if(this.moveRightKey.isDown && !this.moveUpKey.isDown && !this.moveDownKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.E);
            }
            else if(this.moveLeftKey.isDown && !this.moveUpKey.isDown && !this.moveDownKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.W);
            }
            else if(this.moveUpKey.isDown && this.moveRightKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.NE);
            }
            else if(this.moveRightKey.isDown && this.moveDownKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.SE);
            }
            if(this.moveUpKey.isDown && this.moveLeftKey.isDown) {
               this.player.tryMoveWithKeyboard(PlayerDrawOrientation.NW);
            }
            else if(this.moveDownKey.isDown && this.moveLeftKey.isDown) {
                this.player.tryMoveWithKeyboard(PlayerDrawOrientation.SW);
            }
            else if(!this.moveLeftKey.isDown && !this.moveUpKey.isDown && !this.moveDownKey.isDown && !this.moveRightKey.isDown) 
            {
                this.player.tryStopMove();
                //this.player.body.velocity.x = 0;
                //this.player.body.velocity.y = 0;
            }
            else {
                //this.player.body.velocity.x = 0;
                //this.player.body.velocity.y = 0;
            }
    
            if(this.firePrimaryWeaponKey.isDown) {
                this.player.tryFirePrimaryWeapon();
            }

            if(this.fireSecondaryWeaponKey.isDown) {
                this.player.tryFireSecondaryWeapon();
            }

            if(this.toggleDebugKey.isDown) {
                this.showDebug = !this.showDebug;
                if(this.showDebug) {
                    this.player.showDebugText();
                    this.player2.showDebugText();
                    this.player3.showDebugText();
                    this.player4.showDebugText();
                }
                if(!this.showDebug) {
                    this.player.hideDebugText();
                    this.player2.hideDebugText();
                    this.player3.hideDebugText();
                    this.player4.hideDebugText();
                }
            }
        }

        this.player.update();

        this.events.emit('playerPositionUpdated', this.player.playerId, this.player.x, this.player.y);

        var path = new Phaser.Curves.Path(400, 400).circleTo(5);

        //var follower = this.add.foll
        //this.player2.setPath(path);
        //this.player2.body.gameObject.s
        
        var temp = Utility.cartesianToIsometric(this.player.MapPosition);

        //this.physics.accelerateTo(this.player2, temp.x, temp.y, 0.25);
        this.intersectPlayer1FlamethrowerParticlesWithEnemies(this.player2);
        this.intersectPlayer1FlamethrowerParticlesWithEnemies(this.player3);
        this.intersectPlayer1FlamethrowerParticlesWithEnemies(this.player4);

        this.player2.updateCpuBehavior(this.player.x, this.player.y);
        this.player2.update();

        this.player3.updateCpuBehavior(this.player.x, this.player.y);
        this.player3.update();

        this.player4.updateCpuBehavior(this.player.x, this.player.y);
        this.player4.update();

        this.updatePickupScaleTime()
        this.pickupObjects.forEach(item => {
            item.update(this.pickupScale);
        })

        this.pickups.forEach(item => {
            let temp = <Phaser.GameObjects.IsoBox>(item);
            temp.setScale(this.pickupScale);
            
            let topColor = new Phaser.Display.Color(150, 0, 0);
            let leftColor = new Phaser.Display.Color(150, 0, 0);
            let rightColor = new Phaser.Display.Color(150, 0, 0);

            /*
            if(this.pickupScaleTime > 30)
                temp.alpha += 0.01;
                //temp.y -= 0.1;
            else if(this.pickupScaleTime < 30 && this.pickupScaleTime > 0)
                temp.alpha -= 0.01;
                //temp.y += 0.1;
            */
            //temp.setMask());//(this.sys.game.getTime() % (Math.PI * 2));
        });

        //this.light.x = this.player.x;
        //this.light.y = this.player.y;

        if(this.showDebug)
            this.debugGraphics.clear().fillStyle(0).fillRectShape(this.physics.world.bounds);
    }

    intersectPlayer1FlamethrowerParticlesWithEnemies(player: Player) {
        var body = <Phaser.Physics.Arcade.Body>player.body;

        const particles = this.player.particleEmitterFlamethrower.overlap(body);        
        if (particles.length > 0)
        {
            let totalDamage = 0;
            particles.forEach(particle => {

                totalDamage += 0.01;                
                //this.explode.emitParticleAt(particle.x, particle.y);
                //particle.kill();
            });
            player.tryDamageWithFlames(totalDamage);
        }
    }

    updatePickupScaleTime(): void {
        if(this.pickupScaleTime > 50)
            this.pickupScale += 0.006;
        else if(this.pickupScaleTime < 50 && this.pickupScaleTime > 0)
            this.pickupScale -= 0.006;
        else if(this.pickupScaleTime == 0)
            this.pickupScaleTime = 100;

        this.pickupScaleTime--;
    }
}
