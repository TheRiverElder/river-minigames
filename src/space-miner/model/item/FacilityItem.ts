import ChainText from "../../../libs/i18n/ChainText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Facility from "../facility/Facility";
import { CreativeType } from "../io/CreativeType";
import Item, { ItemType } from "./Item";

export default class FacilityItem extends Item {

    static readonly TYPE = new CreativeType("facility", (game, data) => new FacilityItem(game, game.facilityPersistor.deserialize(data.facility, game)));

    readonly facility: Facility; 

    override get type(): ItemType {
        return FacilityItem.TYPE;
    }
    
    override get name(): string {
        return "facility";
    }

    override get displayedName(): Text {
        const nameParts: Array<Text> = [this.facility.displayedName];
        if (this.facility.name) nameParts.push(new PlainText(`: ${this.facility.name}`));
        return new ChainText(nameParts);
    }

    override get description(): Text {
        return this.facility.description;
    }

    constructor(game: Game, facility: Facility) {
        super(game, 1);
        this.facility = facility;
    }

    override onSerialize(context: Game): any {
        return {
            facility: this.game.facilityPersistor.serialize(this.facility, this.game),
        };
    }

    override matches(item: Item): boolean {
        return item instanceof FacilityItem && item.facility === this.facility;
    }

    override getImage(): string {
        return `./assets/image/miner.svg`;
    }
}