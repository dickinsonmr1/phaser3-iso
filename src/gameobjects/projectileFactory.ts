import { Scene } from "phaser";
import { Projectile, ProjectileType } from "./projectile";

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
                    return new Projectile({
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
                    return new Projectile({
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
                    return new Projectile({
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
                case ProjectileType.HomingRocket:
                    return new Projectile({
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
                    return new Projectile({
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