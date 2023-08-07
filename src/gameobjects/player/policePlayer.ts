import { Player } from "./player";

export class PolicePlayer extends Player
{
    constructor(params){
        super(params);
    }
    
    init() {
        super.init();
    }

    createAnims() {
        // https://en.wikipedia.org/wiki/Points-of-the-compass
        var sourceFrameKey = "police256";
        this.animPrefix = "police256";                   
                        
        this.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-SW'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-W-SW'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-W'}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-W-NW'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-NW'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-N-NW'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-N'}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-N-NE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-NE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-E-NE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-E'}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-E-SE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-SE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-S-SE'}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-S'}],
            frameRate: 10,
        });            
        this.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '-S-SW'}],
            frameRate: 10,
        });    
    }
}