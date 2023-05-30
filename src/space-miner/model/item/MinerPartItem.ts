import MinerPart from "../miner/MinerPart";
import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerPartItem extends Item {

    static readonly TYPE = new ItemType("miner_part", () => new MinerPartItem(null as any));

    override get type(): ItemType {
        return MinerPartItem.TYPE;
    }

    override get name(): string {
        return `挖矿姬零件：${this.part.type.name}`;
    }

    readonly part: MinerPart;

    constructor(part: MinerPart) {
        super()
        this.part = part
    }

}