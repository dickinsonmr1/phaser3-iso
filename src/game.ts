/**
 * @author       Mark Dickinson
 * @copyright    2022
 * @license      none
 */


import 'phaser';
import { SceneController } from './scenes/sceneController';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 1920,
    height: 1080,
    pixelArt: true,
    input: { keyboard: true, gamepad: true },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            /*
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugVelocityColor: 0xffff00,
            debugBodyColor: 0x0000ff,
            debugStaticBodyColor: 0xffffff
            */
        }
    },
    scene: [SceneController]
};

const game = new Phaser.Game(config);