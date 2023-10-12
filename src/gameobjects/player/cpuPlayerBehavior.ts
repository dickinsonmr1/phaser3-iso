import { CpuPlayerPattern } from "./cpuPlayerPatternEnums";
import { PlayerDrawOrientation } from "./playerDrawOrientation";
import { v4 as uuidv4 } from 'uuid';

export class CpuPlayerBehavior {
    
    private cpuPlayerPattern: CpuPlayerPattern = CpuPlayerPattern.Follow;
    
    //private cpuFleeDirection: PlayerDrawOrientation = PlayerDrawOrientation.E;

    private cpuDestination: Phaser.Math.Vector2;
    private cpuDestinationTargetIcon: Phaser.GameObjects.Image;
    private cpuDestinationTargetText: Phaser.GameObjects.Text;

    private playerId: uuidv4;
    private playerName: string;

    constructor(playerId: uuidv4, playerName: string, cpuDestination: Phaser.Math.Vector2,
        cpuDestinationTargetIcon: Phaser.GameObjects.Image,
        cpuDestinationTargetText: Phaser.GameObjects.Text)
    {
        this.playerId = playerId;
        this.playerName = playerName;
        this.cpuDestination = cpuDestination;
        this.cpuDestinationTargetIcon = cpuDestinationTargetIcon;
        this.cpuDestinationTargetText = cpuDestinationTargetText;
    }

    setCpuPlayerPattern(newPattern: CpuPlayerPattern){
        this.cpuPlayerPattern = newPattern;        
    }

    getCpuPlayerPattern(): CpuPlayerPattern{
        return this.cpuPlayerPattern;        
    }

    setCpuDestination(cpuDestination: Phaser.Math.Vector2) {
        this.cpuDestination = cpuDestination;
    }

    getCpuDestination(): Phaser.Math.Vector2 {
        return this.cpuDestination;
    }

    updateCpuBehavior(playerPosition: Phaser.Math.Vector2, cpuPlayerPatternOverride: CpuPlayerPattern, healthPercentage: number) {
        // TODO: implement
    }

    updateDebugElementsLocation () {
        //this.cpuDestination = cpuDestination;
        this.cpuDestinationTargetIcon.setPosition(this.cpuDestination.x, this.cpuDestination.y);
        this.cpuDestinationTargetText.setPosition(this.cpuDestination.x, this.cpuDestination.y);
        this.cpuDestinationTargetText.setText(`${(this.playerName)} target: (${(this.cpuDestination.x).toFixed(2)}, ${(this.cpuDestination.y).toFixed(2)})`);
    }
}