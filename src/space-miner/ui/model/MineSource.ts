import type { double, Pair } from "../../../libs/CommonTypes";
import { sumBy } from "../../../libs/lang/Collections";
import type Miner from "./Miner";
import type MineType from "./MineType";

export default class MineSource {

    readonly mines: Array<Pair<MineType, double>>;

    constructor(mineTypes: Iterable<Pair<MineType, double>>) {
        this.mines = Array.from(mineTypes);
    }
     

    drain(query: double, miner: Miner): Array<Pair<MineType, double>> {
        const mined: Array<[MineType, double]> = [];
        const mineableMines = this.mines.filter(([type, amount]) => type.hardness <= miner.strength);
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

        return mined;
    }
}