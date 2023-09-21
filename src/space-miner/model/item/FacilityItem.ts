import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Facility from "../facility/Facility";
import Item from "./Item";
import ItemType from "./ItemType";

export default class FacilityItem extends Item {

    static readonly TYPE = new ItemType("facility", () => new FacilityItem(null as any));

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

    constructor(facility: Facility) {
        super(1);
        this.facility = facility;
    }

    override matches(item: Item): boolean {
        return item instanceof FacilityItem && item.facility === this.facility;
    }
    
    override doCopy(): Item {
        return new FacilityItem(this.facility.copy());
    }

    override getImage(): string {
        return `./assets/image/miner.svg`;
    }
}