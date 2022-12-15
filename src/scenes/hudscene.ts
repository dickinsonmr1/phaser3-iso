import { SceneController } from "./sceneController";

 
 export class HudScene extends Phaser.Scene {
    
    fpsText;
    sceneController: SceneController

    constructor(sceneController: SceneController){
        super({key: "HudScene"});

        this.sceneController = sceneController;
    }

    preload () {

    }

    
    create () {

        this.fpsText = this.add.text(10, 10, 'FPS: -- \n-- Particles', {
            font: 'bold 26px Arial'
        });

        //  Grab a reference to the Game Scene        
        let ourGame = this.scene.get('GameScene');
        ourGame.events.on('updateFPS', function (delta) {
            this.fpsText.setText('FPS: ' + (1000/delta).toFixed(3));// + '\n' +            

        }, this);

        this.scene.setVisible(true);
        this.scene.bringToTop();
    }

    
    update(time, delta): void {
        
        //particles.emitters.first.alive.length + ' Particles');
    }
 }
