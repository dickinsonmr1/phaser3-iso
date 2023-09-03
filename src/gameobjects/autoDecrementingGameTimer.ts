export class AutoDecrementingGameTimer {
    
    public currentTime: integer;
    
    public maxDuration: integer;
    public transitionInThresholdTime: integer;
    public transitionOutThresholdTime: integer;

    constructor(maxDuration: integer, inTime?: integer, outTime?: integer) {

    }

    startTimer() {
        this.currentTime = this.maxDuration;
    }
    
    update() {
        this.currentTime--;
    }

    stopTimer() {
        this.currentTime = 0;
    }
}