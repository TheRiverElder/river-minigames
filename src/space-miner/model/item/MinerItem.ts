import Miner from "../miner/Miner";
import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerItem extends Item {

    static readonly TYPE = new ItemType("miner", () => new MinerItem(null as any));

    readonly miner: Miner; 

    override get type(): ItemType {
        return MinerItem.TYPE;
    }

    constructor(miner: Miner) {
        super(1);
        this.miner = miner;
    }
}