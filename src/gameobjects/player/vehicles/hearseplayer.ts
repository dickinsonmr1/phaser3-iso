import { Player } from "../player";

export class HearsePlayer extends Player
{
    constructor(params){
        super(params);


    }
    
    init() {
        super.init();
    }

    createAnims(scene: Phaser.Scene) {
        // https://en.wikipedia.org/wiki/Points_of_the_compass
        var sourceFrameKey = "blackCars";
        this.animPrefix = "hearseBlack";
        
        var colorString = 'c07'               
        var startIndex = 97;
                        
        scene.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });            
        scene.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });    

    }

    maxHealth(): number {
        return 40;
    }
    
    maxSpeed(): number {
        return 220;
    }
}