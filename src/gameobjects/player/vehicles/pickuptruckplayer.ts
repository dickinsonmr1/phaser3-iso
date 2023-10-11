import * as Phaser from 'phaser';
import { Player } from "../player";

export class PickupTruckPlayer extends Player
{
    constructor(params){
        super(params);
    }
    
    init() {
        super.init();
    }

    createAnims(scene: Phaser.Scene) {  
        this.animPrefix = "pickupTruckOrange";
        var startIndex = 161;
        
        scene.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        scene.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        scene.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });            
        scene.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });            
    }

    maxHealth(): number {
        return 40;
    }

    maxSpeed(): number {
        return 230;
    }
        
    bodyDrawSize(): number {
        return 48;
    }

    bodyDrawOffset(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(10, 10);   
    }
    getDistanceBeforeStopping(): number { 
        return 300;
    }
}