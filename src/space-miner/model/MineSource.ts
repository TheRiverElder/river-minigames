import { double } from "../../libs/CommonTypes";
import Item from "./item/Item";
import CollectorPart from "./miner/CollectorPart";
import { InOrbLocation } from "./orb/Orb";

export default interface MineSource {

    // readonly mines: Array<ResourceItem>;

    // constructor(mines: Iterable<ResourceItem> = []) {
    //     this.mines = Array.from(mines);
    // }

    onDrain(collector: CollectorPart, requiringAmount: double, location: InOrbLocation): Array<Item>;

    // getMineralList(): Array<Item>;
}