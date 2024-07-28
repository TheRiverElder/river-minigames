import ChainText from "../../../libs/i18n/ChainText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import Facility, { FacilityType } from "../facility/Facility";
import { CreativeType } from "../io/CreativeType";
import Item, { ItemType } from "./Item";
import { isEqual } from "lodash";

export default class FacilityItem extends Item {

    static readonly TYPE: ItemType =
        new CreativeType("facility", (type, game, data) => new FacilityItem(game, game.facilityPersistor.registry.getOrThrow(data.facilityType)));


    override get type(): ItemType {
        return FacilityItem.TYPE;
    }

    override get name(): string {
        return "facility";
    }

    private cachedFacility: Facility | null = null;
    private previewFacility(): Facility {
        if (this.cachedFacility) return this.cachedFacility;
        else return (this.cachedFacility = this.createFacility());
    }

    override get displayedName(): Text {
        const nameParts: Array<Text> = [this.previewFacility().displayedName];
        if (this.previewFacility().name) nameParts.push(new PlainText(`: ${this.previewFacility().name}`));
        return new ChainText(nameParts);
    }

    override get description(): Text {
        return this.previewFacility().description;
    }

    constructor(
        game: Game,
        private readonly facilityType: FacilityType,
        private readonly facilityData: any = {},
    ) {
        super(game, 1);
    }

    override onSerialize(context: Game): any {
        return {
            facilityType: this.facilityType.id,
            facilityData: this.facilityData,
        };
    }

    override matches(item: Item): boolean {
        return item instanceof FacilityItem && item.facilityType === this.facilityType && isEqual(item.facilityData, this.facilityData);
    }

    override getImage(): string {
        return `./assets/image/miner.svg`;
    }

    createFacility(): Facility {
        return this.facilityType.create(this.game, this.facilityData);
    }
}