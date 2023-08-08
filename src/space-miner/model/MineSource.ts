import Game from "../Game";
import Item from "./item/Item";
import ResourceItem from "./item/ResourceItem";
import type Miner from "./miner/Miner";

export default class MineSource {

    readonly mines: Array<ResourceItem>;

    constructor(mines: Iterable<ResourceItem> = []) {
        this.mines = Array.from(mines);
    }

    onDrain(miner: Miner): Array<Item> {
        const collectorHardness = miner.collector.hardness;
        const result: Array<Item> = [];
        for (let i = 0; i < this.mines.length;) {
            const mine = this.mines[i];
            if (mine.resourceType.hardness > collectorHardness) continue;
    
            const removedAmount = Math.min((collectorHardness + 1) * 15, mine.amount);
            const removedResource = mine.take(removedAmount);
            // console.log(removedResource);
            if (removedResource.amount <= 0) continue;
            if (mine.amount <= 0) {
                this.mines.splice(i, 1);
            } else {
                i++;
            }
    
            result.push(removedResource);
        }
        return result;
    }

    tick(game: Game) {
        // this.mines.entries().forEach(([type, amount]) => {
        //     // TODO 资源的恢复
        // });
    }
}