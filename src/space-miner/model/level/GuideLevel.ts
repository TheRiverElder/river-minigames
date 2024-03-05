import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { filterNotNull } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import ConfiguredGoal from "./ConfiguredGoal";
import Goal from "./Goal";
import Level from "./Level";

export default class GuideLevel implements Level {

    public readonly goals: Array<ConfiguredGoal<GuideLevel>>;

    constructor(
        public readonly game: Game,
        goals: Array<Goal>,
    ) {
        this.goals = goals.map(it => new ConfiguredGoal(this, it))
    }

    get completed(): boolean {
        return this.ordinal >= this.goals.length;
    }

    getTitle(): Text {
        const currentGoal = this.currentGoal;
        return new I18nText("level.guide.title", { "goal_name": currentGoal?.goal.getName() ?? "" });
    }

    getDescription(): Text {
        return this.currentGoal?.goal.getDescription() ?? new I18nText("level.guide.description");
    }

    get currentGoal(): Nullable<ConfiguredGoal> {
        return this.goals[this.ordinal];
    }

    private ordinal = 0;

    get displayedGoals() {
        return filterNotNull([this.currentGoal]);
    }

    postTick(game: Game) {
        if (this.completed) return;
        this.currentGoal?.postTick();
    }

    onGoalComplete(goal: Goal): void {
        this.ordinal++;
        this.game
    }

}