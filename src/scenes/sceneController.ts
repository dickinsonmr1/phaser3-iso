import * as Phaser from 'phaser';
import GameScene from "./gameScene";
import { HudScene } from "./hudscene";
import { TitleScene } from './titleScene';
import { VehicleType } from '../gameobjects/player/player';
import { v4 as uuidv4 } from 'uuid';
import { WeatherType } from '../gameobjects/weather';
import { TimeOfDayType } from '../gameobjects/timeOfDayType';
import { PauseScene } from './pauseScene';

export class SceneController extends Phaser.Scene {
    hudScene: HudScene;
    gameScene: GameScene;
    titleScene: TitleScene;
    pauseScene: PauseScene;

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
        this.addGamepadListeners();
        
        this.titleScene = new TitleScene(this);
        this.game.scene.add("TitleScene", this.titleScene);
        this.scene.launch('TitleScene');
    }

    launchGame(player1VehicleType: VehicleType, weatherType: WeatherType, timeOfDayType: TimeOfDayType) {
        this.titleScene.scene.sleep();

        this.gameScene = new GameScene(this, player1VehicleType, weatherType, timeOfDayType);
        this.game.scene.add("GameScene", this.gameScene);
        this.scene.launch('GameScene');

        this.hudScene = new HudScene(this);        
        this.game.scene.add("HudScene", this.hudScene);
        this.scene.launch('HudScene');

        this.pauseScene = new PauseScene(this);
        this.game.scene.add("PauseScene", this.pauseScene);

        this.scene.bringToTop("HudScene");
    }

    pauseGame() {

        this.scene.pause('GameScene');            
        this.scene.pause('HudScene');
        this.scene.setVisible(false, "HudScene");
        //this.sound.pauseAll();

        this.scene.launch("PauseScene");
        this.scene.bringToTop("PauseScene")

        //this.pauseScene.sound.play("pauseSound");
    }

    returnToGame() {
        this.scene.sleep('PauseScene');   

        //this.gameScene.gameTimeStarted = this.sys.game.loop.time;
        this.scene.wake('GameScene');               
        this.scene.wake('HudScene');
        this.scene.setVisible(true, 'HudScene');  
        
        //this.gameScene.sound.play("resumeSound");
    }

    addHudForPlayerId(playerId: uuidv4, playerName: string, playerMaxHealth: number) {
        this.hudScene.setOverlay(playerId, playerName, playerMaxHealth);
    }

    update(): void {

    }

    returnToTitleScene() {

        //var destinationName = this.mainScene.worldName;
        //var gameProgress = new GameProgress();
        //gameProgress.save(destinationName);

        this.removeGameScenes();

        this.scene.wake('TitleScene');
        this.titleScene.menuController.reset();
    }

    removeGameScenes(): void {
        //this.scene.remove('LoadingScene');
        this.scene.remove('GameScene');
        this.scene.remove('HudScene');
        this.scene.remove('PauseScene');

        this.gameScene = null;
        this.hudScene = null;
        this.pauseScene = null;
        //this.scene.remove('LevelCompleteScene');
    }

    addGamepadListeners(): void {
        this.input.gamepad.once('connected', pad => {
         
        });
    }
}