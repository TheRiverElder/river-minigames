import { Predicator, double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Orb from "../orb/Orb";
import Goal from "./Goal";

export default class ResourceAmountGoal implements Goal {

    constructor(
        public readonly game: Game, 
        public readonly targetAmount: double, 
        public readonly findOrb: Predicator<Orb>,
    ) { }

    getName(): Text { return new I18nText(`goal.resource_amount.name`); }
    getDescription(): Text { return new I18nText(`goal.resource_amount.description`); }

    getProgressText(): Text { return new PlainText(this.getAmountOfTheOrb().toFixed(0) + " U."); }
    getGoalText(): Text { return new PlainText(this.targetAmount + " U."); }

    getProgress(): number {
        return this.getAmountOfTheOrb() / this.targetAmount;
    }

    getAmountOfTheOrb(): double {
        const orb = Array.from(this.game.profile.ownedOrbs).find(this.findOrb) ?? null;
        if (!orb) return 0;
        return orb.supplimentNetwork.resources.total;
    }

    setup(): void { }
    destory(): void { }
    
}