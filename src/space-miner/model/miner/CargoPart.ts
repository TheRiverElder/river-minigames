import { double } from "../../../libs/CommonTypes";
import Inventory from "../Inventory";
import Item from "../item/Item";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_CARGO } from "./MinerPartTypes"

export default class CargoPart extends MinerPart {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_CARGO;
    }

    readonly capacity: double;
    readonly inventory = new Inventory();

    constructor(capacity: double) {
        super();
        this.capacity = capacity;
    }

    // 返回放入的数量
    addItem(item: Item): Item {
        const amount = Math.min(this.capacity - this.inventory.total, item.amount);
        if (amount <= 0) return item.copy(0);
        const i = item.copy(amount);
        this.inventory.add(i);
        return i;
    }

    // 返回实际移除的数量
    removeItem(item: Item): Item {
        return this.inventory.remove(item);
    }


}