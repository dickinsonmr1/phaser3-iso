import { Player, PlayerOrientation } from './player';
import 'phaser';

export default class Demo extends Phaser.Scene
{
    playerSpeed: number = 2;
    player: Player;

    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;

    moveNorthKey: Phaser.Input.Keyboard.Key;
    moveSouthKey: Phaser.Input.Keyboard.Key;
    moveEastKey: Phaser.Input.Keyboard.Key;
    moveWestKey: Phaser.Input.Keyboard.Key;

    fireWeaponKey: Phaser.Input.Keyboard.Key;

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
       var map = this.add.tilemap('map');

        console.log(map);

        var tileset1 = map.addTilesetImage('iso-64x64-outside', 'tiles');
        var tileset2 = map.addTilesetImage('iso-64x64-building', 'tiles2');

        var layer1 = map.createLayer('Tile Layer 1', [ tileset1, tileset2 ]);
        //var layer2 = map.createLayer('Tile Layer 2', [ tileset1, tileset2 ]);
        //var layer3 = map.createLayer('Tile Layer 3', [ tileset1, tileset2 ]);
        //var layer4 = map.createLayer('Tile Layer 4', [ tileset1, tileset2 ]);
        //var layer5 = map.createLayer('Tile Layer 5', [ tileset1, tileset2 ]);

        //player = this.add.sprite(100, 100, 'utilityCars', 'police_W.png');

        this.player = new Player({
            scene: this,
            x: 200,
            y: 200,
            key: "utilityCars",
            frame: 'police_W.png',
            playerId: "Police",
            //isMyPlayer: true,
            //isMultiplayer: this.isMultiplayer
        });        

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

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.zoomInKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.zoomOutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.moveNorthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.moveSouthKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.moveEastKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.moveWestKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.fireWeaponKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

    }

    update(time, delta) {
        //player.y -= 1;
        this.controls.update(delta);

        if(this.zoomInKey.isDown)
            this.cameras.main.zoom -= 0.01;

        if(this.zoomOutKey.isDown)
            this.cameras.main.zoom += 0.01;  

        if(this.moveNorthKey.isDown && !this.moveEastKey.isDown && !this.moveWestKey.isDown) {
            this.player.y -= 1 * this.playerSpeed;
            this.player.anims.play('police-N', true);
            this.player.playerOrientation = PlayerOrientation.N;
        }
        else if(this.moveSouthKey.isDown && !this.moveEastKey.isDown && !this.moveWestKey.isDown) {
            this.player.y += 1 * this.playerSpeed;
            this.player.anims.play('police-S', true);
            this.player.playerOrientation = PlayerOrientation.S;
        }
        else if(this.moveEastKey.isDown && !this.moveNorthKey.isDown && !this.moveSouthKey.isDown) {
            this.player.x += 1 * this.playerSpeed;
            this.player.anims.play('police-E', true);
            this.player.playerOrientation = PlayerOrientation.E;
        }
        else if(this.moveWestKey.isDown && !this.moveNorthKey.isDown && !this.moveSouthKey.isDown) {
            this.player.x -= 1 * this.playerSpeed;
            this.player.anims.play('police-W', true);
            this.player.playerOrientation = PlayerOrientation.W;
        }
        else if(this.moveNorthKey.isDown && this.moveEastKey.isDown) {
            this.player.x += Math.cos(Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-NE', true);
            this.player.playerOrientation = PlayerOrientation.NE;
        }
        else if(this.moveNorthKey.isDown && this.moveWestKey.isDown) {
            this.player.x += Math.cos(3 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(3 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-NW', true);
            this.player.playerOrientation = PlayerOrientation.NW;
        }
        if(this.moveSouthKey.isDown && this.moveEastKey.isDown) {
            this.player.x += Math.cos(7 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(7 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-SE', true);
            this.player.playerOrientation = PlayerOrientation.SE;
        }
        else if(this.moveSouthKey.isDown && this.moveWestKey.isDown) {
            this.player.x += Math.cos(5 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(5 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-SW', true);
            this.player.playerOrientation = PlayerOrientation.SW;
        }

        if(this.fireWeaponKey.isDown) {
            this.player.tryFireBullet();
        }

        this.player.update();
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 1920,
    height: 1080,
    scene: Demo
};

const game = new Phaser.Game(config);
