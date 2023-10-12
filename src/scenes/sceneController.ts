import * as Phaser from 'phaser';
import GameScene from "./gameScene";
import { HudScene } from "./hudscene";
import { TitleScene } from './titleScene';
import { VehicleType } from '../gameobjects/player/player';
import { v4 as uuidv4 } from 'uuid';

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

        this.gameScene = new GameScene(this, player1VehicleType);
        this.game.scene.add("GameScene", this.gameScene);
        this.scene.launch('GameScene');

        this.hudScene = new HudScene(this);        
        this.game.scene.add("HudScene", this.hudScene);
        this.scene.launch('HudScene');

        this.scene.bringToTop("HudScene");
    }

    addHudForPlayerId(playerId: uuidv4, playerName: string, playerMaxHealth: number) {
        this.hudScene.setOverlay(playerId, playerName, playerMaxHealth);
    }

    update(): void {

    }
}