import { Predicator, double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import { sumBy } from "../../../libs/lang/Collections";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import ResourceItem from "../item/ResourceItem";
import ResourceType from "../misc/ResourceType";
import Orb from "../orb/Orb";
import Goal from "./Goal";

export default class SpecificResourceAmountGoal implements Goal {

    constructor(
        public readonly game: Game, 
        public readonly resourceType: ResourceType, 
        public readonly targetAmount: double, 
        public readonly findOrb: Predicator<Orb>,
    ) { }

    getName(): Text { return new I18nText(`goal.specific_resource_amount.name`); }
    getDescription(): Text { return new I18nText(`goal.specific_resource_amount.description`, {
        "target_amount": shortenAsHumanReadable(this.targetAmount),
        "resource_type": new I18nText(`resource_type.${this.resourceType.name}`),
    }); }

    getProgressText(): Text { return new PlainText(this.getValue().toFixed(0) + " U."); }
    getGoalText(): Text { return new PlainText(this.targetAmount + " U."); }

    getProgress(): number {
        return this.getValue() / this.targetAmount;
    }

    getValue(): double {
        const orb = Array.from(this.game.profile.ownedOrbs).find(this.findOrb) ?? null;
        if (!orb) return 0;
        return sumBy(orb.supplimentNetwork.resources.content, 
            it => (it instanceof ResourceItem && it.resourceType === this.resourceType) ? it.amount : 0);
    }

    setup(): void { }
    destory(): void { }
    
}