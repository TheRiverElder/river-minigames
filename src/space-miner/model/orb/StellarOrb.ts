import { double, int } from "../../../libs/CommonTypes";
import ResourceItem from "../item/ResourceItem";
import Miner from "../miner/Miner";
import ResourceType from "../ResourceType";
import { RESOURCE_TYPE_CORE_LAVA, RESOURCE_TYPE_PLASMA_LAVA, RESOURCE_TYPE_WATER, RESOURCE_TYPE_WOOD } from "../ResourceTypes";
import World from "../World";
import Orb, { OrbBodyData } from "./Orb";

export interface TerraLikeOrbData {
    coreAltitude: double; // 液态地核高度
    surfaceAltitude: double; // 地表高度，会比总半径小一点
}

// 恒星，只有一种资源：等离子熔浆
export default class StellarOrb extends Orb {

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, mines: Iterable<ResourceItem>) {
        super(world, uid, name, bodyData, mines);
    }

    override onDrain(type: ResourceType, miner: Miner): void {
        const location = miner.location;
        if (!location) return;
        const altitude = this.radius - location.depth;
        
        if (type === RESOURCE_TYPE_PLASMA_LAVA) return super.onDrain(type, miner);
        return;
    }
}