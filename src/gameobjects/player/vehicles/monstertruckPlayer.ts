import * as Phaser from 'phaser';
import { Player } from "../player";

export class MonsterTruckPlayer extends Player
{
    constructor(params){
        super(params);
    }
    
    init() {
        super.init();
    }

    createAnims(scene: Phaser.Scene) {
        // https://en.wikipedia.org/wiki/Points_of_the_compass
        var sourceFrameKey = "monstertruck256";
        this.animPrefix = "monstertruck256";                   
                        
        scene.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_SW'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_W_SW'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_W'}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_W_NW'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_NW'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_N_NW'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_N'}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_N_NE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_NE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_E_NE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_E'}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_E_SE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_SE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_S_SE'}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_S'}],
            frameRate: 10,
        });            
        scene.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: sourceFrameKey, frame: this.animPrefix + '_S_SW'}],
            frameRate: 10,
        });    
    }

    maxHealth(): number {
        return 80;
    }
    
    maxSpeed(): number {
        return 200;
    }
        
    bodyDrawSize(): number {
        return 72;
    }

    bodyDrawOffset(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(64, 64);   
    }
    getDistanceBeforeStopping(): number { 
        return 200;
    }
}