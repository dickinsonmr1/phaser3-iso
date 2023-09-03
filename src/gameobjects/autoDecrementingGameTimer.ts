export class AutoDecrementingGameTimer {
    
    public currentTime: integer;
    
    public maxDuration: integer;
    public transitionInThresholdTime: integer;
    public transitionOutThresholdTime: integer;

    constructor(maxDuration: integer, inTime?: integer, outTime?: integer) {
        this.maxDuration = maxDuration;
        this.transitionInThresholdTime = inTime ?? 0;
        this.transitionOutThresholdTime = outTime ?? 0;
    }

    startTimer() {
        this.currentTime = this.maxDuration;
    }
    
    update() {
        this.currentTime--;

        if(this.currentTime <= 0)
            this.stopTimer();
    }

    stopTimer() {
        this.currentTime = 0;
    }

    isActive(): boolean {
        return this.currentTime > 0;
    }
}