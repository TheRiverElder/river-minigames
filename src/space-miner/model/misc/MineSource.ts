import { double } from "../../../libs/CommonTypes";
import Collector from "./Collector";
import Item from "../item/Item";
import { InOrbLocation } from "../orb/Orb";

export default interface MineSource {

    // readonly mines: Array<ResourceItem>;

    // constructor(mines: Iterable<ResourceItem> = []) {
    //     this.mines = Array.from(mines);
    // }

    onDrain(collector: Collector, requiringAmount: double, location: InOrbLocation): Array<Item>;

    // getMineralList(): Array<Item>;
}