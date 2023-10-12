import { double } from "../../../libs/CommonTypes";
import Item from "../item/Item";
import Inventory from "../misc/storage/Inventory";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_CARGO } from "./MinerPartTypes"

export default class CargoPart extends MinerPart<CargoPart> {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_CARGO;
    }

    protected override get descriptionArgs(): any {
        return {
            "total": this.inventory.total.toFixed(2),
            "capacity": this.capacity.toFixed(2),
        };
    }

    readonly inventory: Inventory;
    get capacity(): double {
        return this.inventory.capacity;
    }

    constructor(capacity: double) {
        super();
        this.inventory = new Inventory(capacity);
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

    override copy(): CargoPart {
        const cargo = new CargoPart(this.capacity);
        // 暂时不复制内容物
        // cargo.inventory.items.push(...this.inventory.items.map(it => it.copy(it.amount)));
        return cargo;
    }

    override equals(another: MinerPart): boolean {
        if (!(another instanceof CargoPart) || (another.capacity !== this.capacity)) return false;
        if (!this.inventory.empty || !another.inventory.empty) return false;
        return true;
    }

}