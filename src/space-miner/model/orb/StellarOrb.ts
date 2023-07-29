import { double } from "../../../libs/CommonTypes";
import Miner from "../miner/Miner";
import ResourceType from "../ResourceType";
import { ResourceTypes } from "../ResourceTypes";
import Orb from "./Orb";

export interface TerraLikeOrbData {
    coreAltitude: double; // 液态地核高度
    surfaceAltitude: double; // 地表高度，会比总半径小一点
}

// 恒星，只有一种资源：等离子熔浆
export default class StellarOrb extends Orb {

    override onDrain(type: ResourceType, miner: Miner): void {
        const location = miner.location;
        if (!location) return;
        // const altitude = this.radius - location.depth;
        
        if (type === ResourceTypes.PLASMA_LAVA) return super.onDrain(type, miner);
        return;
    }
}