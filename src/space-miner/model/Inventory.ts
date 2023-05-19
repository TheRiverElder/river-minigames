import { double, Pair } from "../../libs/CommonTypes";
import { mutate, sum } from "../../libs/lang/Collections";
import MineType from "./MineType";

export default class Inventory {

    private slots: Map<MineType, double>;

    constructor(entries: Iterable<Pair<MineType, double>> = []) {
        this.slots = new Map(entries);
    }

    add(type: MineType, amount: double) {
        mutate(this.slots, type, () => 0, p => Math.max(0, p + amount));
    }

    get(type: MineType): double {
        return this.slots.get(type) || 0;
    }

    entries(): Array<Pair<MineType, double>> {
        return Array.from(this.slots.entries());
    }

    remove(type: MineType, amount: double) {
        mutate(this.slots, type, () => 0, p => Math.max(0, p - amount));
    }

    removeAll(type: MineType) {
        if (!this.slots.has(type)) return 0;
        const result = this.slots.get(type) || 0;
        this.slots.delete(type);
        return result;
    }

    get total(): double {
        return sum(Array.from(this.slots.values()));
    }

    
}