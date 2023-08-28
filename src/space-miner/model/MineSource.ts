import Game from "../Game";
import Item from "./item/Item";
import type Miner from "./miner/Miner";
import { MinerLocation } from "./miner/Miner";

export default interface MineSource {

    // readonly mines: Array<ResourceItem>;

    // constructor(mines: Iterable<ResourceItem> = []) {
    //     this.mines = Array.from(mines);
    // }

    onDrain(miner: Miner, location: MinerLocation): Array<Item>;

    getMineralList(): Array<Item>;
}