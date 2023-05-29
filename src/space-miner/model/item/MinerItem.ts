import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerItem extends Item {

    static readonly TYPE = new ItemType("miner", () => new MinerItem());

    override get type(): ItemType {
        return MinerItem.TYPE;
    }

    override matches(item: Item): boolean {
        return false; // 一律不可堆叠
    }

}