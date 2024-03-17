import { Displayable } from "../../../libs/io/Displayable";
import Text, { TextModel } from "../../../libs/i18n/Text";
import Game from "../../Game";
import ConfiguredGoal, { GoalModel } from "./ConfiguredGoal";
import Goal from "./Goal";

export default interface Level<G extends Goal = Goal> extends Displayable<LevelModel> {

    getTitle(): Text;
    getDescription(): Text;

    get displayedGoals(): Array<ConfiguredGoal<Level<G>, G>>;

    get completed(): boolean;

    postTick(game: Game): void;

    onGoalComplete(goal: G): void;

    // UI中点击“确定”时候调用，一般用于指示说明的已阅
    onChecked(): void;
}

export type LevelModel = Readonly<{
    title: TextModel;
    description: TextModel;
    displayedGoals: Array<GoalModel>;
}>;