import { double, int } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import Technology from "../technology/Technology";
import Goal from "./Goal";

export default class TechnologyUnlockedGoal implements Goal {

    constructor(
        public readonly game: Game, 
        public readonly technologyName: string, 
        public readonly technologyLevel: int,
    ) { }

    private cacheUnlocked = false;

    checkTechnologyUnlocked(): boolean {
        if (this.cacheUnlocked) return true;

        const technology = this.game.technologies.getOrThrow(Technology.getRegistryName(this.technologyName, this.technologyLevel));
        const result = this.game.profile.unlockedTechnologies.has(technology);
        this.cacheUnlocked = result;
        return result;
    }

    getName(): Text { return new I18nText(`goal.technology_unlocked.name`); }
    getDescription(): Text { return new I18nText(`goal.technology_unlocked.description`, {
        "technology_name": new I18nText(`technology.${this.technologyName}.name`),
        "technology_level": this.technologyLevel,
    }); }

    getProgressText(): Text { return new I18nText(`technology.common.${this.checkTechnologyUnlocked() ? "unlocked" : "locked"}`); }
    getGoalText(): Text { return new I18nText(`technology.${this.technologyName}.name`); }

    getProgress(): number {
        return this.checkTechnologyUnlocked() ? 1 : 0;
    }

    getValue(): double {
        return this.checkTechnologyUnlocked() ? 1 : 0;
    }

    private listener = (technology: Technology) => {
        if (technology.name === this.technologyName && technology.level === this.technologyLevel) this.cacheUnlocked = true;
        this.game.listeners.TECHNOLOGY_UNLOCKED.remove(this.listener);
    }

    setup(): void {
        if (this.checkTechnologyUnlocked()) return;
        this.game.listeners.TECHNOLOGY_UNLOCKED.add(this.listener);
    }

    destory(): void {
        this.game.listeners.TECHNOLOGY_UNLOCKED.remove(this.listener);
    }
    
}