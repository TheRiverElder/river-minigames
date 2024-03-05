import Game from "../../Game";
import ConfiguredGoal from "./ConfiguredGoal";
import Goal from "./Goal";

export default abstract class Level<G extends Goal = Goal> {
    readonly goals: Array<ConfiguredGoal<Level<G>, G>>;

    abstract getTitle(): Text;
    abstract getDescription(): Text;

    get displayedGoals(): Array<ConfiguredGoal<Level<G>, G>> {
        return this.goals.slice();
    }

    private allGoalsCompleted: boolean = false;
    get completed(): boolean { return this.allGoalsCompleted; }

    constructor(goals: Array<G>) {
        this.goals = goals.map(it => new ConfiguredGoal(this, it));
    }

    postTick(game: Game) {
        if (this.completed) return;
        this.goals.forEach(it => it.postTick());
        this.allGoalsCompleted = this.goals.every(it => it.completed);
    }

    onGoalComplete(goal: G) {
        // Nothing
    }
}