import { IsolatedFunction } from "../CommonTypes";

export default class SimpleTimer {

    private pid: number | null = null;
    private stopFlag = false;

    constructor(
        public readonly tasks: Array<IsolatedFunction> = [],
        public period: number = 0,
    ) { }

    start() {
        this.stopFlag = false;
        if (this.pid !== null) return;
        this.loop();
    }

    stop() {
        this.stopFlag = true;
        if (this.pid === null) return;
        clearTimeout(this.pid);
    }

    private loop = () => {
        if (this.stopFlag) return;
        for (const task of this.tasks) {
            task();
        }
        if (this.period <= 0) return;
        setTimeout(this.loop, this.period);
    };
}