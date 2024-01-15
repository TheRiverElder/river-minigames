import Game from "../../Game";
import Goal from "./Goal";

export default class Level {
    readonly goals: Array<Goal>;

    private allGoalsCompleted: boolean = false;
    get completed(): boolean { return this.allGoalsCompleted; }

    constructor(goals: Array<Goal>) {
        this.goals = goals;
    }

    postTick(game: Game) {
        if (this.completed) return;
        this.allGoalsCompleted = this.goals.every(it => it.getProgress() >= 1);
    }
}