import type { double, Pair } from "../../libs/CommonTypes";
import { withNotnull } from "../../libs/lang/Objects";
import Inventory from "./Inventory";
import type Miner from "./Miner";
import type MineType from "./MineType";

export default class MineSource {

    readonly mines = new Inventory();

    constructor(mines: Iterable<Pair<MineType, double>>) {
        // this.mines = withNotnull(new Inventory(), inventory => Array.from(mines).forEach(it => inventory.add(it)));
    }

    onDrain(type: MineType, miner: Miner) {
        // if (type.hardness > miner.strength) return;

        // const rest = this.mines.remove(miner.size);
        // if (rest <= 0) return;

        // const mined = Math.min(rest, miner.size);
        // this.mines.remove(type, mined);

        // miner.inventory.add(type, mined);
    }

    tick() {
        // this.mines.entries().forEach(([type, amount]) => {
        //     // TODO 资源的恢复
        // });
    }
}