export class GameTimeDelayTimer {

    targetGameTime: number;
    interval: number;

    constructor(interval) {
        this.interval = interval;
        this.targetGameTime = 0;
    }

    startTimer(gameTimeNow: number) {
        this.targetGameTime = gameTimeNow + this.interval;
    }

    isExpired(gameTimeNow: number) {
        return gameTimeNow > this.targetGameTime;
    }
}