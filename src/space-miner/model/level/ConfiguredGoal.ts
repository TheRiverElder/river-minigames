import Goal from "./Goal";
import Level from "./Level";

export default class ConfiguredGoal<L extends Level = Level, G extends Goal = Goal> {

    constructor(
        public readonly level: L,
        public readonly goal: G,
        public hadCompleted: boolean = false, // 曾经达成过一次便会一直为true，哪怕之后进度回落，也会保持为true
    ) { }

    get completed(): boolean {
        return this.goal.getProgress() >= 1;
    }

    postTick() {
        if (!this.hadCompleted && this.completed) {
            this.hadCompleted = true;
            this.level.onGoalComplete(this.goal);
        }
    }
}