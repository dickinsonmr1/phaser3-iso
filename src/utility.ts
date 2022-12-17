
import 'phaser';

export class Point {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Utility {
    constructor() {

    }

    static MapToScreen(mapX: number, mapY: number) : Point {
        var TILE_WIDTH_HALF = 32;
        var TILE_HEIGHT_HALF = 16;

        var screenX = (mapX - mapY) * TILE_WIDTH_HALF;
        var screenY = (mapX + mapY) * TILE_HEIGHT_HALF;
        return new Point(screenX, screenY);
    }

    static ScreenToMap(screenX: number, screenY: number) : Point {
        var TILE_WIDTH_HALF = 32;
        var TILE_HEIGHT_HALF = 16;

        var mapX = (screenX / TILE_WIDTH_HALF + screenY / TILE_HEIGHT_HALF) /2;
        var mapY = (screenY / TILE_HEIGHT_HALF -(screenX / TILE_WIDTH_HALF)) /2;

        return new Point(mapX, mapY);
    }
    
    // https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-primer-for-game-developers-updated--cms-28392

    static cartesianToIsometric(cartPt) {
        var tempPt = new Phaser.Geom.Point();
        tempPt.x = cartPt.x - cartPt.y;
        tempPt.y = (cartPt.x + cartPt.y)/2;
        return (tempPt);
    }

    static isometricToCartesian(isoPt) {
        var tempPt = new Phaser.Geom.Point();
        tempPt.x = (2*isoPt.y + isoPt.x)/2;
        tempPt.y = (2*isoPt.y - isoPt.x)/2;
        return (tempPt);
    }

    static getTileCoordinates(cartPt, tileHeight) {
        var tempPt = new Phaser.Geom.Point();
        tempPt.x = Math.floor(cartPt.x / tileHeight);
        tempPt.y = Math.floor(cartPt.y / tileHeight);
        return(tempPt);
    }

    static TileXYtoCartesianCoordinates(x, y) {
        var tempPt = new Phaser.Geom.Point(x, y);
        return tempPt;
    }
}