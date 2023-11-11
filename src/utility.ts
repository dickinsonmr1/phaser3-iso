
import * as Phaser from 'phaser';

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

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static getRandomEnumValue(values) {
        return Utility.getRandomInt(Object.keys(values).length / 2);
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
        var tempPt = new Phaser.Math.Vector2();
        tempPt.x = cartPt.x - cartPt.y;
        tempPt.y = (cartPt.x + cartPt.y)/2;
        return (tempPt);
    }

    static isometricToCartesian(isoPt) {
        var tempPt = new Phaser.Math.Vector2();
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

    static SnapTo16DirectionAngle(angle) {      
        //        -1 PI  1 PI 
        //   -0.5PI           0.5 PI
        //         0 PI  0 PI
        if(angle >= 15 * Math.PI / 16 || angle < - 15 * Math.PI / 16) {
            return 1;
        }

        else if(angle >= 13 * Math.PI / 16 && angle < 15 * Math.PI / 16) {
            return 14 * Math.PI / 16;
        }
        else if(angle >= 11 * Math.PI / 16 && angle < 13 * Math.PI / 16) {
            return 12 * Math.PI / 16;
        }
        else if(angle >= 9 * Math.PI / 16 && angle < 11 * Math.PI / 16) {
            return 10 * Math.PI / 16;
        }

        else if(angle >= 7 * Math.PI / 16 && angle < 9 * Math.PI / 16) {
            return 8 * Math.PI / 16;
        }

        else if(angle >= 5 * Math.PI / 16 && angle < 7 * Math.PI / 16) {
            return 6 * Math.PI / 16;
        }
        else if(angle >= 3 * Math.PI / 16 && angle < 5 * Math.PI / 16) {
            return 4 * Math.PI / 16;
        }
        else if(angle >= Math.PI / 16 && angle < 3 * Math.PI / 16) {
            return 2 * Math.PI / 16;
        }

        else if(angle >= -Math.PI / 16 && angle < Math.PI / 16) {
            return 0;
        }

        else if(angle >= -3 * Math.PI / 16 && angle < -Math.PI / 16) {
            return -2 * Math.PI / 16;
        }
        else if(angle >= -5 * Math.PI / 16 && angle < -3 * Math.PI / 16) {
            return -4 * Math.PI / 16;
        }
        else if(angle >= -7 * Math.PI / 16 && angle < -5 * Math.PI / 16) {
            return -6 * Math.PI / 16;
        }

        else if(angle >= -9 * Math.PI / 16 && angle < -7 * Math.PI / 16) {
            return -8 * Math.PI / 16;
        }

        else if(angle >= -11 * Math.PI / 16 && angle < -9 * Math.PI / 16) {
            return -10 * Math.PI / 16;
        }
        else if(angle >= -13 * Math.PI / 16 && angle < -11 * Math.PI / 16) {
            return -12 * Math.PI / 16;
        } 
        else if(angle >= -15 * Math.PI / 16 && angle < -13 * Math.PI / 16) {
            return -14 * Math.PI / 16;
        } 
    }
}