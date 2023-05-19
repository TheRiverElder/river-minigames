import type { double, Pair } from "../../libs/CommonTypes";
import { sumBy } from "../../libs/lang/Collections";
import Inventory from "./Inventory";
import type Miner from "./Miner";
import type MineType from "./MineType";

export default class MineSource {

    readonly mines = new Inventory();

    constructor(mines: Iterable<Pair<MineType, double>>) {
        this.mines = new Inventory(mines);
    }

    onDrain(query: double, miner: Miner): Array<Pair<MineType, double>> {
        const mined: Array<[MineType, double]> = [];
        const mineableMines = this.mines.entries().filter(([type, amount]) => type.hardness <= miner.strength);
        const total = sumBy(mineableMines, a => a[1]);
        if (total === 0) return [];
        for (const item of mineableMines) {
            const [type, amount] = item;
            if (type.hardness > miner.strength) continue;

            const rate = amount / total;
            const delta = query * rate;
            item[1] -= delta;

            mined.push([type, delta]);
        }
        
        mined.forEach(([type, amount]) => {
            this.mines.remove(type, amount);
            miner.inventory.add(type, amount);
        });

        return mined;
    }
}