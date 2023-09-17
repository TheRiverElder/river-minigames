import { double, int } from "../../../libs/CommonTypes";
import Collector from "../facility/Collector";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import { ResourceTypes } from "../ResourceTypes";
import World from "../World";
import Orb, { InOrbLocation, OrbBodyData } from "./Orb";

export interface TerraLikeOrbData {
    coreAltitude: double; // 液态地核高度
    surfaceAltitude: double; // 地表高度，会比总半径小一点
}

// 恒星，只有一种资源：等离子熔浆
export default class StellarOrb extends Orb {

    plasmaLavaAmount: double;

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, plasmaLavaAmount: double) {
        super(world, uid, name, bodyData);
        this.plasmaLavaAmount = plasmaLavaAmount;
    }

    override onDrain(collector: Collector, requiringAmount: double, location: InOrbLocation): Array<Item> {
        const tokenAmount = Math.min(requiringAmount, this.plasmaLavaAmount);
        if (tokenAmount <= 0) return [];
        const item = new ResourceItem(ResourceTypes.PLASMA_LAVA, tokenAmount);
        if (!collector.canCollect(item)) return [];
        this.plasmaLavaAmount -= tokenAmount;
        return [item];
    }

    // override getMineralList(): Array<Item> {
    //     return [new ResourceItem(ResourceTypes.PLASMA_LAVA, this.plasmaLavaAmount)];
    // }
}