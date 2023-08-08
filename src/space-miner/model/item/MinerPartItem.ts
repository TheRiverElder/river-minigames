import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import MinerPart from "../miner/MinerPart";
import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerPartItem extends Item {

    static readonly TYPE = new ItemType("miner_part", () => new MinerPartItem(null as any));

    override get type(): ItemType {
        return MinerPartItem.TYPE;
    }

    override get name(): Text {
        return this.part.name;
    }

    override get description(): Text {
        return this.part.description;
    }

    readonly part: MinerPart;

    constructor(part: MinerPart) {
        super(1);
        this.part = part;
    }

    override matches(item: Item): boolean {
        return item instanceof MinerPartItem && item.part === this.part;
    }
    
    override doCopy(): Item {
        return new MinerPartItem(this.part.copy());
    }

    public get image(): string {
        return `./assets/image/${this.part.type.name}.svg`;
    }

}