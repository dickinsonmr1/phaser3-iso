import { Constants } from "../constants";
import { Player, PlayerDrawOrientation, VehicleType } from "../gameobjects/player";
import { Point, Utility } from "../utility";
import { SceneController } from "./sceneController";

export default class GameScene extends Phaser.Scene
{    
    sceneController: SceneController;

    //playerSpeed: number = 0.25;
    player: Player;
    player2: Player;
    player3: Player;
    player4: Player;

    public showDebug: boolean = false;

    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;

    moveUpKey: Phaser.Input.Keyboard.Key;
    moveDownKey: Phaser.Input.Keyboard.Key;
    moveLeftKey: Phaser.Input.Keyboard.Key;
    moveRightKey: Phaser.Input.Keyboard.Key;

    fireWeaponKey: Phaser.Input.Keyboard.Key;
    
    gamepad: Phaser.Input.Gamepad.Gamepad;
    mostRecentCartesianGamepadAxes: Phaser.Geom.Point = new Phaser.Geom.Point(0,0);

    light: any;

    layer1 : Phaser.Tilemaps.TilemapLayer;
    layer2 : Phaser.Tilemaps.TilemapLayer;
    layer3 : Phaser.Tilemaps.TilemapLayer;
    layer4 : Phaser.Tilemaps.TilemapLayer;
    layer5 : Phaser.Tilemaps.TilemapLayer;
    layerPickups : Phaser.Tilemaps.TilemapLayer;

    constructor (sceneController: SceneController)
    {
        super('GameScene');

        this.sceneController = sceneController;
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
        //
        this.load.image('playerGunLaser1', './assets/sprites/weapons/laserPurpleDot15x15.png');
        this.load.image('rocket', './assets/sprites/weapons/rocket_2_small_down.png');

        // tiles
        this.load.image('tiles', './assets/iso-64x64-outside.png');
        this.load.image('tiles2', './assets/iso-64x64-building.png');
        //this.load.image('crateTilesWood', './assets/crates - wood 64x64.png');
        this.load.image('crateTilesMetal', './assets/Crates - Metal 64x64.png');
        this.load.tilemapTiledJSON('map', './assets/isoCarCombat.json');
        this.load.atlasXML('utilityCars', './assets/vehicles/sheet_utility.png', './assets/vehicles/sheet_utility.xml');        

        this.load.image('explosion', './assets/sprites/explosions/tank_explosion3.png');
        //this.load.atlasXML('tanksSpritesheet', './assets/sprites/weapons/tanks_spritesheetDefault.png', './assets/sprites/weapons/tanks_spritesheetDefault.xml');
    }

    create ()
    {
        //this.physics.world.setBounds(-200, -200, 400, 400);


        var map = this.add.tilemap('map');

        console.log(map);

        var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
        var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');
        var tilesetPickups = map.addTilesetImage('Crates - Metal 64x64', 'crateTilesMetal');

        // https://www.phaser.io/examples/v3/view/game-objects/lights/tilemap-layer
        this.layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]).setPipeline('Light2D');
        this.layerPickups = map.createLayer('Pickups', [ tileset1, tileset2, tilesetPickups ]).setPipeline('Light2D');

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

        this.player = new Player({
            scene: this,
            mapX: 200,
            mapY: 200,
            //mapX: 10,
            //mapY: 10,
            key: "utilityCars",
            frame: 'police_W.png',
            playerId: "Police",
            vehicleType: VehicleType.Police
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        this.player.init();        
       
        this.player2 = new Player({
            scene: this,
            mapX: 500,
            mapY: 500,
            key: "utilityCars",
            frame: 'garbage_W.png',
            playerId: "Trash Man",
            vehicleType: VehicleType.TrashMan
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        this.player2.init();
    
        this.player3 = new Player({
            scene: this,
            mapX: 100,
            mapY: 400,
            key: "utilityCars",
            frame: 'taxi_NE.png',
            playerId: "Taxi",
            vehicleType: VehicleType.Taxi
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        this.player3.init();

        this.player4 = new Player({
            scene: this,
            mapX: 300,
            mapY: 50,
            key: "utilityCars",
            frame: 'ambulance_NE.png',
            playerId: "Ambulance",
            vehicleType: VehicleType.Ambulance
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        this.player4.init();


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

        this.physics.add.overlap(this.player, this.layerPickups);
        this.layerPickups.setTileIndexCallback(Constants.pickupSpawnTile, this.playerTouchingTileHandler, this);

        
        this.layerPickups.forEachTile(tile => {
            if(tile.index == Constants.pickupSpawnTile) {
                const x = ((tile.x * tile.width)) / 2; //tile.x;// tile.getCenterX();
                const y = ((tile.y * tile.height)) / 2; //tile.y;//tile.getCenterY();                
               
                var temp = Utility.cartesianToIsometric(new Point(x, y));
                //var temp = this.lights.addLight(x, y, 200).setIntensity(3);

                var text = this.add.text(temp.x, temp.y, 'Rockets', {
                    font: 'bold 12px Arial'
                });
                text.depth = 10;

                

                var isoBox = this.add.isobox(temp.x, temp.y, 24, 12, 0xEEEEEE, 0xFF0000, 0x999999);
                isoBox.alpha = 0.5;

                //this.layerPickups.removeTileAt(tile.x, tile.y);
            }
        })        

        //var isoBox = this.add.isobox(50, 50, 64, 32, 0xEEEEEE, 0xFF0000, 0x999999);
        //isoBox.alpha = 0.5;

        //this.physics.add.collider(this.player, isoBox);

        this.physics.add.overlap(this.player2, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));
        this.physics.add.overlap(this.player3, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));
        this.physics.add.overlap(this.player4, this.player.bullets, (enemy, bullet) => this.bulletTouchingEnemyHandler(enemy, bullet));


        this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 0);

        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.moveUpKey = cursors.up;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.moveDownKey = cursors.down; //this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.moveRightKey = cursors.right;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.moveLeftKey = cursors.left;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.fireWeaponKey = cursors.space;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        this.addGamePadListeners();        
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
    }

    playerTouchingTileHandler(sprite, tile): boolean {
        let scene = <GameScene>this;//.scene;
        scene.layerPickups.removeTileAt(tile.x, tile.y);

        return true;
    }

    

    bulletTouchingEnemyHandler(enemy: any, bullet: any): void {       

        var otherPlayer = <Player>enemy;
        otherPlayer.tryDamage();

        bullet.remove();
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
                //this.player.tryMoveSpaceship(leftAxisX, leftAxisY);                    
            }
            else {
                this.player.tryStopMove();
                //this.player.tryStopSpaceShipY();
            }                    

            if(pad.B || pad.R2) {
                this.player.tryFireBulletWithGamepad(this.mostRecentCartesianGamepadAxes.x, this.mostRecentCartesianGamepadAxes.y);
                //this.player.tryFireBullet(scene.sys.game.loop.time, scene.sound);
            }         
            
            if(pad.L1)
                this.cameras.main.zoom -= 0.01;

            if(pad.R1)
                this.cameras.main.zoom += 0.01;
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
            else {
                //this.player.body.velocity.x = 0;
                //this.player.body.velocity.y = 0;
            }
    
            if(this.fireWeaponKey.isDown) {
                this.player.tryFireBullet();
            }
        }

        this.player.update();
        this.player2.update();
        this.player3.update();
        this.player4.update();

        //this.light.x = this.player.x;
        //this.light.y = this.player.y;
    }
}
