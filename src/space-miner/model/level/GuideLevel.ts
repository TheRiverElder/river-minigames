import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import { filterNotNull } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import ConfiguredGoal from "./ConfiguredGoal";
import Goal from "./Goal";
import Level from "./Level";
import LevelCheckedGoal from "./LevelCheckedGoal";

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
        const texts: Text[] = [
            new I18nText(`level.guide.description.${this.ordinal}`),
        ];
        if (this.currentGoal) {
            texts.push(new PlainText("\n"), this.currentGoal.goal.getDescription());
        }
        return new ChainText(texts);
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
        this.game.displayMessage(new I18nText("level.guide.goal_complete", { "goal_name": goal.getName() }));
        this.game.listeners.OVERLAY.emit("level_start");
    }

    onChecked(): void {
        const g = this.currentGoal;
        if (!g) return;

        if (g instanceof LevelCheckedGoal) {
            g.checked = true;
        }
    }
}