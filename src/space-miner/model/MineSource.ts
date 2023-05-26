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

    onDrain(type: MineType, miner: Miner) {
        if (type.hardness > miner.strength) return;

        const rest = this.mines.get(type);
        if (rest <= 0) return;

        const mined = Math.min(rest, miner.size);
        this.mines.remove(type, mined);

        miner.inventory.add(type, mined);
    }

    tick() {
        this.mines.entries().forEach(([type, amount]) => {
            // TODO 资源的恢复
        });
    }
}