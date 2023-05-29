import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerItem extends Item {

    static readonly TYPE = new ItemType("miner", ([...args]) => new MinerItem(...args));

    override matches(item: Item): boolean {
        return false; // 一律不可堆叠
    }

    override copy(amount: number): Item {
        return new MinerItem(this.type, this.game, amount);
    }

    override onUse(): void { }

}