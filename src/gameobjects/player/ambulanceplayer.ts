import { Player } from "./player";

export class AmbulancePlayer extends Player
{
    constructor(params){
        super(params);


    }
    
    init() {
        super.init();
    }

    createAnims() {                
        // https://en.wikipedia.org/wiki/Points_of_the_compass

        var sourceFrameKey = "whiteCars";
        this.animPrefix = "vanWhite";
        var startIndex = 129;
        
        this.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });            
        this.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });    
    }
}