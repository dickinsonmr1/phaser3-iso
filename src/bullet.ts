// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_combatMechanics.js
import "phaser";
import { Scene } from "phaser";
import { Utilities } from "./utilities";
/*
import { Constants } from "../client/constants";
import { MainScene } from "../client/scenes/mainScene";
import { Socket } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';
*/

export class Bullet extends Phaser.GameObjects.Sprite {

    public damage: number;
    public velocityX: number;
    public velocityY: number;
    //public bulletId: uuidv4;
    public initiated: boolean = false;

    public MapPosition: Phaser.Geom.Point;

    constructor(params)
    {
        super(params.scene, params.isometricX, params.isometricY, params.key);

        this.MapPosition = new Phaser.Geom.Point(params.mapPositionX, params.mapPositionY); 
        //this.bulletId = uuidv4();

        this.scene.add.existing(this);
               
        this.flipX = params.flipX;
        this.damage = params.damage;       
        this.velocityX = params.velocityX;
        //if(params.velocityY != null)
            this.velocityY = params.velocityY;
        //else   
            //this.velocityY = 0;

        this.scene.physics.world.enable(this);
       
        this.setAlpha(1.0);
        this.setDepth(1);//Constants.depthBullets);
    }

    public getScene(): Scene {
        return this.scene;
    }

    public init() {       
        this.initiated = true;
    }

    preUpdate(time, delta): void {  
        if(this.initiated) {

            var utility = new Utilities();    
            super.preUpdate(time, delta);

            //var body = <Phaser.Physics.Arcade.Body>this.body;
            //body.setVelocityX(this.velocityX);
            //body.setVelocityY(this.velocityY);
            this.MapPosition.x += this.velocityX;
            this.MapPosition.y += this.velocityY;
            
            var isoPosition = utility.cartesianToIsometric(this.MapPosition);
            this.x = isoPosition.x;
            this.y = isoPosition.y;
        }
        /*
        console.log('bulletMovement');

        var socket = this.getSocket();        
        if(socket != null) {
            // sends back to server
            socket.emit('bulletMovement', {bulletId: this.bulletId, x: this.x, y: this.y, velocityX: this.velocityX});                
        }
        */
    }
    /*
    getSocket(): Socket {
        let scene = <MainScene>this.scene;            
        return scene.sceneController.socketClient.socket;
    }*/
}

