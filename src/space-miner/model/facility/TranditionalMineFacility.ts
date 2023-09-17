import { int } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import ResourceItem from "../item/ResourceItem";
import Collector from "./Collector";
import Facility from "./Facility";

export default class TranditionalMineFacility extends Facility {
    get displayedName(): Text {
        return new I18nText(`facility.tranditional_mine.name`);
    }

    get description(): Text {
        return new I18nText(`facility.tranditional_mine.description`);
    }

    readonly collector = new HumanCollector();

    population: int = 0;

    setup(): void {
        // TODO
    }

    override tick(game: Game): void {
        if (!this.location) return;
        this.location.orb.onDrain(this.collector, 50 * this.population, this.location);
    }

    copy(): Facility {
        return new TranditionalMineFacility();
    }
}

export class HumanCollector implements Collector {
    canCollect(item: ResourceItem): boolean {
        return true;
    }
}