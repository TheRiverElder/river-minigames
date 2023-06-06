import { int } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Profile from "../Profile";

export default class Technology {
    readonly name: string;
    readonly level: int;
    readonly priors: Array<Technology>; // 前置技术

    constructor(name: string, level: int = 1, priors: Array<Technology> = []) {
        this.name = name;
        this.level = level;
        this.priors = priors.slice();
    }

    // 可以override以匹配更多条件
    canUnlock(profile: Profile, game: Game): boolean {
        return this.priors.every(prior => profile.unlockedTechnologies.has(prior));
    }

    onUnlock(profile: Profile, game: Game) {
    }
}