import { Scene } from "phaser";
import { Projectile } from "./projectile";
import { Rocket } from "./rocket";
import { FreezeRocket } from "./freezeRocket";
import { Airstrike } from "./airstrike";
import { Bullet } from "./bullet";
import { ProjectileType } from "./projectileType";
import { Rocks } from "./rocks";

export class ProjectileFactory {
    constructor() {

    }

    generateProjectile(scene: Scene, projectileType: ProjectileType,
        isometricX: number, isometricY: number,
        mapPositionX: number, mapPositionY: number,
        weaponImageKey: string,
        damage: number,
        velocityX: number,
        velocityY: number,
        scaleX: number,
        scaleY: number,
        angle: number): Projectile {

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
                        angle: angle
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
                        angle: angle
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
                        angle: angle
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
                        angle: angle
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
                        angle: angle
                    }); 
            }
    }
}