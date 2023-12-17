import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import { CreativeType } from "../io/CreativeType";
import MinerPart from "../miner/MinerPart";
import Item, { ItemType } from "./Item";

export default class MinerPartItem extends Item {

    static readonly TYPE = new CreativeType<Item>("miner_part", (p, data) => new MinerPartItem(p.game, null as any));

    override get type(): ItemType {
        return MinerPartItem.TYPE;
    }

    override get displayedName(): Text {
        return this.part.name;
    }

    override get description(): Text {
        return this.part.description;
    }

    readonly part: MinerPart;

    constructor(game: Game, part: MinerPart) {
        super(game, 1);
        this.part = part;
    }

    override matches(item: Item): boolean {
        return item instanceof MinerPartItem && this.part.equals(item.part);
    }

    override getImage(): string {
        return `./assets/image/${this.part.type.name}.svg`;
    }

}