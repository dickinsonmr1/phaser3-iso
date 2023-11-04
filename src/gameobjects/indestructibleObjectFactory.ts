import * as Phaser from 'phaser';
import { Constants } from "../constants";
import { Point, Utility } from "../utility";

export class IndestructibleObjectFactory {
    constructor() {

    }

    generateObject(physics: Phaser.Physics.Arcade.ArcadePhysics, tileKey: number, mapLocation: Phaser.Math.Vector2): Phaser.GameObjects.Image {

    if(tileKey == Constants.building1ObjectTileSW)            
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-a-sw-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);
    else if(tileKey == Constants.building1ObjectTileSE)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-a-se-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);
    
    else if(tileKey == Constants.building2ObjectTileSW)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-garage-sw-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);
    else if(tileKey == Constants.building2ObjectTileSE)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-garage-se-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);

    else if(tileKey == Constants.building3ObjectTileSW)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-d-sw-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);
    else if(tileKey == Constants.building3ObjectTileSE)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-d-se-128x128', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,64), 0, 0.75);

    else if(tileKey == Constants.building4ObjectTileSW)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-c-se-128x202', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,128), 0, 0.75);
    else if(tileKey == Constants.building4ObjectTileSE)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-c-sw-128x202', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,128), 0, 0.75);
        
    else if(tileKey == Constants.building5ObjectTileSW)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-b-SE-128x197', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,128), 64, 0.75);
    else if(tileKey == Constants.building5ObjectTileSE)
        return this.generateBuilding(mapLocation, physics,  'buildingSpritesheet', 'building-small-b-sw-128x171', new Phaser.Math.Vector2(0, -32), new Phaser.Math.Vector2(100, 32), new Phaser.Math.Vector2(16,128), 64, 0.75);

    }

    generateBuilding(tileLocation: Phaser.Math.Vector2, physics: Phaser.Physics.Arcade.ArcadePhysics, key: string, frame: string,
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
        return sprite;
       
    }
}