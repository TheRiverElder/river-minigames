import { int } from "../../../libs/CommonTypes";
import Game from "../global/Game";
import Profile from "../global/Profile";

export default class Technology {

    public static getRegistryName(name: string, level: int = 1) {
        return name + "@" + level;
    }

    constructor(
        public readonly name: string,
        public readonly level: int = 1,
        public readonly priors: Array<Technology> = [], // 前置技术
    ) { }

    // 可以override以匹配更多条件
    canUnlock(profile: Profile, game: Game): boolean {
        return this.priors.every(prior => profile.unlockedTechnologies.has(prior));
    }

    onUnlock(profile: Profile, game: Game) {
    }

    getDisplayedModel(): TechnologyModel {
        return {
            name: this.name,
            level: this.level,
            priors: this.priors.map(it => it.name),
        };
    }

    get registryName(): string {
        return Technology.getRegistryName(this.name, this.level);
    }
}

export type TechnologyModel = {
    readonly name: string;
    readonly level: int;
    readonly priors: Array<string>;
};