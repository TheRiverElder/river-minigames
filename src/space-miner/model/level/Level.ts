import Text, { TextModel } from "../../../libs/i18n/Text";
import Game from "../global/Game";
import ConfiguredGoal, { GoalInfoModel, GoalModel } from "./ConfiguredGoal";
import Goal from "./Goal";

export default interface Level<G extends Goal = Goal> {

    getTitle(): Text;
    getDescription(): Text;

    get displayedGoals(): Array<ConfiguredGoal<Level<G>, G>>;

    get completed(): boolean;

    postTick(game: Game): void;

    onGoalComplete(goal: G): void;

    // UI中点击“确定”时候调用，一般用于指示说明的已阅
    onChecked(): void;

    setup(): void;

    getDisplayedModel(): LevelModel;
    getDisplayedInfoModel(): LevelInfoModel;
}

export type LevelInfoModel = Readonly<{
    title: TextModel;
    displayedGoals: Array<GoalInfoModel>;
}>;

export type LevelModel = Readonly<{
    title: TextModel;
    description: TextModel;
    displayedGoals: Array<GoalModel>;
    displayedCompleted: boolean;
}>;