import { double } from "../../../libs/CommonTypes";
import { Displayable } from "../../../libs/io/Displayable";
import { TextModel } from "../../../libs/i18n/Text";
import Goal from "./Goal";
import Level from "./Level";

export default class ConfiguredGoal<L extends Level = Level, G extends Goal = Goal> implements Displayable<GoalModel> {

    constructor(
        public readonly level: L,
        public readonly goal: G,
        public hadCompleted: boolean = false, // 曾经达成过一次便会一直为true，哪怕之后进度回落，也会保持为true
    ) { }

    getDisplayedModel(): GoalModel {
        return {
            name: this.goal.getName().getDisplayedModel(),
            description: this.goal.getDescription().getDisplayedModel(),
            progressText: this.goal.getProgressText().getDisplayedModel(),
            goalText: this.goal.getGoalText().getDisplayedModel(),
            progress: this.goal.getProgress(),
        };
    }

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

export type GoalModel = Readonly<{
    name: TextModel;
    description: TextModel;
    progressText: TextModel;
    goalText: TextModel;
    progress: double;
}>;