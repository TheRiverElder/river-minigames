import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { filterNotNull } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import ConfiguredGoal from "./ConfiguredGoal";
import Goal from "./Goal";
import Level from "./Level";

export default class GuideLevel extends Level {

    override getTitle(): Text {
        const currentGoal = this.currentGoal;
        return new I18nText("level.guide.title", { "goal_name": currentGoal?.goal.getName() ?? ""  });
    }

    override getDescription(): Text {
        return this.currentGoal?.goal.getDescription() ?? new I18nText("level.guide.description");
    }

    get currentGoal(): Nullable<ConfiguredGoal> {
        return this.goals[this.ordinal];
    }

    private ordinal = 0;

    override get displayedGoals() {
        return filterNotNull([this.currentGoal]);
    }

    override postTick(game: Game) {
        if (this.completed) return;
        this.currentGoal?.postTick();
        this.allGoalsCompleted = this.ordinal >= this.goals.length;
    }

    override onGoalComplete(goal: Goal): void {
        this.ordinal++;
    }

}