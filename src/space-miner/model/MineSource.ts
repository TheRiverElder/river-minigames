import { withNotnull } from "../../libs/lang/Objects";
import Game from "../Game";
import Inventory from "./Inventory";
import MinerItem from "./item/MinerItem";
import ResourceItem from "./item/ResourceItem";
import type Miner from "./Miner";
import type ResourceType from "./ResourceType";

export default class MineSource {

    readonly mines = new Inventory();

    constructor(mines?: Iterable<ResourceItem>) {
        if (!mines) return;
        this.mines = withNotnull(new Inventory(), inventory => Array.from(mines).forEach(it => inventory.add(it)));
    }

    onDrain(type: ResourceType, miner: Miner) {
        if (type.hardness > miner.strength) return;

        const rest = this.mines.remove(new ResourceItem(type, 10));
        if (rest.amount <= 0) return;

        miner.inventory.add(rest);
    }

    tick(game: Game) {
        // this.mines.entries().forEach(([type, amount]) => {
        //     // TODO 资源的恢复
        // });
    }
}