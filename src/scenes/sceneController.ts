import * as Phaser from 'phaser';
import GameScene from "./gameScene";
import { HudScene } from "./hudscene";

export class SceneController extends Phaser.Scene {
    hudScene: HudScene;
    gameScene: GameScene;

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
        this.hudScene = new HudScene(this);
        this.game.scene.add("HudScene", this.hudScene);
        this.scene.launch('HudScene');

        this.gameScene = new GameScene(this);
        this.game.scene.add("GameScene", this.gameScene);
        this.scene.launch('GameScene');

        this.scene.bringToTop("HudScene");
    }

    update(): void {

    }
}