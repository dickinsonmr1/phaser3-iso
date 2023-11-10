import * as Phaser from 'phaser';
import { Constants } from "../constants";
import { Point, Utility } from "../utility";

export class DestructibleObjectFactory {
    constructor() {

    }

    generateObject(physics: Phaser.Physics.Arcade.ArcadePhysics, tileKey: number, mapLocation: Phaser.Math.Vector2): Phaser.GameObjects.Image {

        if(tileKey == Constants.houseObjectTile)
            return this.generate(mapLocation, physics, 'houseTile', '',
                        new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(50, 15), new Phaser.Math.Vector2(40,32),
                        64, 1);
        if(tileKey == Constants.treeObjectTile)
            return this.generate(mapLocation, physics, 'treeTile', '',
                    new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(50, 15), new Phaser.Math.Vector2(40,32),
                    64, 1);
    }

    private generate(tileLocation: Phaser.Math.Vector2, physics: Phaser.Physics.Arcade.ArcadePhysics, key: string, frame: string,
        drawOffset: Phaser.Math.Vector2,
        bodySize: Phaser.Math.Vector2,
        physicsBodyOffset: Phaser.Math.Vector2,        
        depthOffset: number,
        drawScale: number): Phaser.GameObjects.Image {

        const x = ((tileLocation.x * 128)) / 2 + 128 / 2; //tile.x;// tile.getCenterX();
        const y = ((tileLocation.y * 64));// tile.height / 2; //tile.y;//tile.getCenterY();                
        
        var temp = Utility.cartesianToIsometric(new Point(x, y));

        var sprite =  physics.add.image(temp.x + drawOffset.x, temp.y + drawOffset.y, key, frame);
        //sprite.setOrigin(0, 1);
        
        sprite.setScale(drawScale);           
        sprite.setDepth(temp.y + depthOffset);            
        
        //'buildingTile2'
        //sprite.setBodySize(180, 25, false);
        //sprite.setOffset(10, 170);
        
        sprite.setBodySize(bodySize.x, bodySize.y, false);
        sprite.setOffset(physicsBodyOffset.x, physicsBodyOffset.y);

        //sprite.setOrigin(0, 1);
        
        //sprite.body.position.y += 1000;
        //sprite.setImmovable(true);
        
        sprite.setPipeline('Light2D');
        return sprite;
       
    }

    /*
        // old code from gameScene
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

            sprite.setPipeline('Light2D');

            //this.layer4.removeTileAt(tile.x, tile.y);
        }
    */
}