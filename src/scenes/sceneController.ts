import * as Phaser from 'phaser';
import GameScene from "./gameScene";
import { HudScene } from "./hudscene";
import { TitleScene } from './titleScene';
import { VehicleType } from '../gameobjects/player';

export class SceneController extends Phaser.Scene {
    hudScene: HudScene;
    gameScene: GameScene;
    titleScene: TitleScene;

    constructor() {
        super({
            key: "SceneManager", active: true
        })
    }

    
    init(data): void {
        //console.log(data.id);        
    }

    preload(): void {        
         
    }

    create() {

        
        this.titleScene = new TitleScene(this);
        this.game.scene.add("TitleScene", this.titleScene);
        this.scene.launch('TitleScene');

    }

    launchGame(player1VehicleType: VehicleType) {
        this.titleScene.scene.stop();

        this.hudScene = new HudScene(this);
        this.game.scene.add("HudScene", this.hudScene);
        this.scene.launch('HudScene');

        this.gameScene = new GameScene(this, player1VehicleType);
        this.game.scene.add("GameScene", this.gameScene);
        this.scene.launch('GameScene');

        this.scene.bringToTop("HudScene");
    }

    update(): void {

    }
}