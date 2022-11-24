import 'phaser';

export default class Demo extends Phaser.Scene
{
    playerSpeed: number = 2;
    player;

    controls: Phaser.Cameras.Controls.SmoothedKeyControl;
    zoomInKey: Phaser.Input.Keyboard.Key;
    zoomOutKey: Phaser.Input.Keyboard.Key;

    moveNorthKey: Phaser.Input.Keyboard.Key;
    moveSouthKey: Phaser.Input.Keyboard.Key;
    moveEastKey: Phaser.Input.Keyboard.Key;
    moveWestKey: Phaser.Input.Keyboard.Key;

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
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

        this.player = this.add.sprite(100, 100, 'utilityCars', 'police_W.png');

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
        }
        else if(this.moveSouthKey.isDown && !this.moveEastKey.isDown && !this.moveWestKey.isDown) {
            this.player.y += 1 * this.playerSpeed;
            this.player.anims.play('police-S', true);
        }
        else if(this.moveEastKey.isDown && !this.moveNorthKey.isDown && !this.moveSouthKey.isDown) {
            this.player.x += 1 * this.playerSpeed;
            this.player.anims.play('police-E', true);
        }
        else if(this.moveWestKey.isDown && !this.moveNorthKey.isDown && !this.moveSouthKey.isDown) {
            this.player.x -= 1 * this.playerSpeed;
            this.player.anims.play('police-W', true);
        }
        else if(this.moveNorthKey.isDown && this.moveEastKey.isDown) {
            this.player.x += Math.cos(Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-NE', true);
        }
        else if(this.moveNorthKey.isDown && this.moveWestKey.isDown) {
            this.player.x += Math.cos(3 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(3 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-NW', true);
        }
        if(this.moveSouthKey.isDown && this.moveEastKey.isDown) {
            this.player.x += Math.cos(7 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(7 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-SE', true);
        }
        else if(this.moveSouthKey.isDown && this.moveWestKey.isDown) {
            this.player.x += Math.cos(5 * Math.PI / 4) * this.playerSpeed;
            this.player.y -= Math.sin(5 * Math.PI / 4) * this.playerSpeed;
            this.player.anims.play('police-SW', true);
        }
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
