import 'phaser'

export class Player extends Phaser.GameObjects.Sprite {
    playerSpeed: number = 2;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.scene.add.existing(this);
    }
}