import { Player, PlayerDrawOrientation } from './player';
import 'phaser';

export default class Demo extends Phaser.Scene
{
    //playerSpeed: number = 0.25;
    player: Player;
    player2: Player;

    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;

    moveUpKey: Phaser.Input.Keyboard.Key;
    moveDownKey: Phaser.Input.Keyboard.Key;
    moveLeftKey: Phaser.Input.Keyboard.Key;
    moveRightKey: Phaser.Input.Keyboard.Key;

    fireWeaponKey: Phaser.Input.Keyboard.Key;

    light: any;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        // hud
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

        //
        this.load.image('playerGunLaser1', './assets/sprites/weapons/laserPurpleDot15x15.png');

        // tiles
        this.load.image('tiles', './assets/iso-64x64-outside.png');
        this.load.image('tiles2', './assets/iso-64x64-building.png');
        this.load.tilemapTiledJSON('map', './assets/isorpg.json');
        this.load.atlasXML('utilityCars', './assets/vehicles/sheet_utility.png', './assets/vehicles/sheet_utility.xml');        
    }

    create ()
    {
        //this.physics.world.setBounds(-200, -200, 400, 400);

        var map = this.add.tilemap('map');

        console.log(map);

        var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
        var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

        var layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
        var layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
        //var layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
        //var layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
        //var layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);


        let colorIndex = 0;
        const spectrum = Phaser.Display.Color.ColorSpectrum(128);

        this.light = this.add.pointlight(400, 300, 0, 20, 1);
        var color = spectrum[colorIndex];

        this.light.color.setTo(color.r, color.g, color.b);
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
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        this.player.init();

        //Animations.createAnims(this.anims);        
        this.player.anims.create({
            key: 'police-N',
            frames: [{key: 'utilityCars', frame: 'police_N.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-S',
            frames: [{key: 'utilityCars', frame: 'police_S.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-E',
            frames: [{key: 'utilityCars', frame: 'police_E.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-W',
            frames: [{key: 'utilityCars', frame: 'police_W.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-NE',
            frames: [{key: 'utilityCars', frame: 'police_NE.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-NW',
            frames: [{key: 'utilityCars', frame: 'police_NW.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-SE',
            frames: [{key: 'utilityCars', frame: 'police_SE.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'police-SW',
            frames: [{key: 'utilityCars', frame: 'police_SW.png'}],
            frameRate: 10,
        });

        var player2 = new Player({
            scene: this,
            x: 250,
            y: 250,
            key: "utilityCars",
            frame: 'garbage_W.png',
            playerId: "Trash Man",
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        
        player2.init();

        //Animations.createAnims(this.anims);        
        this.player.anims.create({
            key: 'garbage-N',
            frames: [{key: 'utilityCars', frame: 'garbage_N.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-S',
            frames: [{key: 'utilityCars', frame: 'garbage_S.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-E',
            frames: [{key: 'utilityCars', frame: 'garbage_E.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-W',
            frames: [{key: 'utilityCars', frame: 'garbage_W.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-NE',
            frames: [{key: 'utilityCars', frame: 'garbage_NE.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-NW',
            frames: [{key: 'utilityCars', frame: 'garbage_NW.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-SE',
            frames: [{key: 'utilityCars', frame: 'garbage_SE.png'}],
            frameRate: 10,
        });
        this.player.anims.create({
            key: 'garbage-SW',
            frames: [{key: 'utilityCars', frame: 'garbage_SW.png'}],
            frameRate: 10,
        });


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

        this.physics.add.collider(this.player, layer1);

        var isoBox = this.add.isobox(50, 50, 64, 32, 0xEEEEEE, 0xFF0000, 0x999999);
        isoBox.alpha = 0.5;

        this.physics.add.collider(this.player, isoBox);

        this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 0);

        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.moveUpKey = cursors.up;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.moveDownKey = cursors.down; //this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.moveRightKey = cursors.right;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.moveLeftKey = cursors.left;//this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        this.fireWeaponKey = cursors.space;// this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    }

    update(time, delta) {
        //player.y -= 1;
        //this.controls.update(delta);

        var body = <Phaser.Physics.Arcade.Body>this.player.body;

        if(this.zoomInKey.isDown)
            this.cameras.main.zoom -= 0.01;

        if(this.zoomOutKey.isDown)
            this.cameras.main.zoom += 0.01;  

        if(this.moveUpKey.isDown && !this.moveLeftKey.isDown && !this.moveRightKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.N);
        }
        else if(this.moveDownKey.isDown && !this.moveLeftKey.isDown && !this.moveRightKey.isDown) {            
            this.player.tryMove(PlayerDrawOrientation.S);
        }
        else if(this.moveRightKey.isDown && !this.moveUpKey.isDown && !this.moveDownKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.E);
        }
        else if(this.moveLeftKey.isDown && !this.moveUpKey.isDown && !this.moveDownKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.W);
        }
        else if(this.moveUpKey.isDown && this.moveRightKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.NE);
        }
        else if(this.moveRightKey.isDown && this.moveDownKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.SE);
        }
        if(this.moveUpKey.isDown && this.moveLeftKey.isDown) {
           this.player.tryMove(PlayerDrawOrientation.NW);
        }
        else if(this.moveDownKey.isDown && this.moveLeftKey.isDown) {
            this.player.tryMove(PlayerDrawOrientation.SW);
        }
        else {
            //this.player.body.velocity.x = 0;
            //this.player.body.velocity.y = 0;
        }

        if(this.fireWeaponKey.isDown) {
            this.player.tryFireBullet();
        }

        this.player.update();
        this.light.x = this.player.x;
        this.light.y = this.player.y;
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 1920,
    height: 1080,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: Demo
};

const game = new Phaser.Game(config);
