import { Scene } from "phaser";
import { Projectile } from "./projectile";
import { Rocket } from "./rocket";
import { FreezeRocket } from "./freezeRocket";
import { Airstrike } from "./airstrike";
import { Bullet } from "./bullet";
import { ProjectileType } from "./projectileType";
import { Rocks } from "./rocks";
import { FlamingSkull } from "./flamingSkull";
import { PlayerDrawOrientation } from "../player/playerDrawOrientation";

export class ProjectileFactory {
    constructor() {

    }

    generateProjectile(scene: Scene, projectileType: ProjectileType,
        isometricX: number, isometricY: number,
        mapPositionX: number, mapPositionY: number,
        aimX: number,
        aimY: number,
        playerDrawOrientation: PlayerDrawOrientation): Projectile {

            var velocityX: number;
            var velocityY: number;
    
            var bulletVelocity = 0;
            var scaleX = 1;
            var scaleY = 1;
            var weaponImageKey = "bullet";

            let damage = 1;
    
            switch(projectileType) {
                case ProjectileType.HomingRocket:
                    bulletVelocity = 550;
                    weaponImageKey = "rocket";
                    scaleX = 0.5;
                    scaleY = 0.5;
                    break;
                case ProjectileType.FireRocket:
                    bulletVelocity = 550;
                    weaponImageKey = "rocket";
                    scaleX = 0.5;
                    scaleY = 0.5;
                    break;
                case ProjectileType.Bullet:
                    bulletVelocity = 700;    
                    weaponImageKey = "bullet";
                    scaleX = 0.25;
                    scaleY = 0.25;
                    break;
                case ProjectileType.Airstrike:
                    bulletVelocity = 500;    
                    weaponImageKey = "deathIcon";
                    scaleX = 1.25;
                    scaleY = 1.25;
                    break;
                case ProjectileType.Freeze:
                    bulletVelocity = 400;
                    weaponImageKey = "freezeRocket";
                    scaleX = 0.5;
                    scaleY = 0.5;
                    break;
                case ProjectileType.Rocks:
                    bulletVelocity = 500;
                    weaponImageKey = "rock";
                    scaleX = 0.5;
                    scaleY = 0.5;
                    break;
                case ProjectileType.FlamingSkull:
                    bulletVelocity = 500;
                    weaponImageKey = "deathIcon";
                    scaleX = 0.4;
                    scaleY = 0.4;
                    break;
            }            
    
            velocityX = aimX * bulletVelocity;
            velocityY = aimY * bulletVelocity;

             //        -1 PI  1 PI 
            //   -0.5PI           0.5 PI
            //         0 PI  0 PI

            var drawAngle = 0;        
            switch(playerDrawOrientation) {
                case PlayerDrawOrientation.N:
                    drawAngle = Math.PI;
                    break;

                case PlayerDrawOrientation.N_NE:                
                    drawAngle = 10 * Math.PI / 12;                            
                    break;
                case PlayerDrawOrientation.NE:                
                    //angle = 3 * Math.PI / 4;  
                    drawAngle = 8 * Math.PI / 12;                            
                    break;
                case PlayerDrawOrientation.E_NE:                
                    drawAngle = 7 * Math.PI / 12;                            
                    break;

                case PlayerDrawOrientation.E:
                    drawAngle = 6 * Math.PI / 12;
                    break;

                case PlayerDrawOrientation.E_SE:                
                    //angle = 3 * Math.PI / 4;  
                    drawAngle = 5 * Math.PI / 12;                            
                    break;

                case PlayerDrawOrientation.SE:                    
                    //angle = 3 * Math.PI / 4;
                    drawAngle = 4 * Math.PI / 12;               
                    break;

                case PlayerDrawOrientation.S_SE:                    
                    //angle = 3 * Math.PI / 4;
                    drawAngle = 2 * Math.PI / 12;               
                    break;

                case PlayerDrawOrientation.S:                
                    drawAngle = 0;
                    break;

                case PlayerDrawOrientation.S_SW:    
                    //angle = -Math.PI / 4;      
                    drawAngle = -2 * Math.PI / 12;                  
                    break;

                case PlayerDrawOrientation.SW:    
                    //angle = -Math.PI / 4;      
                    drawAngle = -4 * Math.PI / 12;                  
                    break;

                case PlayerDrawOrientation.W_SW:    
                    //angle = -Math.PI / 4;      
                    drawAngle = -5 * Math.PI / 12;                  
                    break;

                case PlayerDrawOrientation.W:
                    drawAngle = -6 * Math.PI / 12;
                    break;        
                
                case PlayerDrawOrientation.W_NW:
                    drawAngle = -7 * Math.PI / 12;
                    break;       

                case PlayerDrawOrientation.NW:
                    //angle = -3 * Math.PI / 4;
                    drawAngle = -8 * Math.PI / 12;               
                    break;

                case PlayerDrawOrientation.N_NW:
                    drawAngle = -10 * Math.PI / 12;
                    break;       
        
            }

            switch(projectileType){
                case ProjectileType.Airstrike:
                    return new Airstrike({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: -drawAngle
                    }); 
                case ProjectileType.Bullet:
                    return new Bullet({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: -drawAngle
                    }); 
                case ProjectileType.FireRocket:
                case ProjectileType.HomingRocket:
                    return new Rocket({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: -drawAngle
                    }); 
                case ProjectileType.Freeze:
                    return new FreezeRocket({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: -drawAngle
                    }); 
                case ProjectileType.Rocks:
                    return new Rocks({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: -drawAngle
                    }); 
                case ProjectileType.FlamingSkull:
                    return new FlamingSkull({
                        scene: scene,
                        projectileType: projectileType,
                        isometricX: isometricX,
                        isometricY: isometricY,
                        mapPositionX: mapPositionX,
                        mapPositionY: mapPositionY,
                        key: weaponImageKey,
                        damage: damage,
                        velocityX: velocityX,
                        velocityY: velocityY,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        angle: 0,
                        isParent: true,
                    }); 
            }
    }
}