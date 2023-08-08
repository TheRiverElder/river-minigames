import { double, int } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import Miner from "../miner/Miner";
import ResourceType from "../ResourceType";
import { ResourceTypes } from "../ResourceTypes";
import World from "../World";
import Orb, { OrbBodyData } from "./Orb";

export interface TerraLikeOrbData {
    coreAltitude: double; // 液态地核高度
    surfaceAltitude: double; // 地表高度，会比总半径小一点
}

// 类泰拉星球，有着固体地幔与地壳，液态地核
// 地核范围在[0, 10%~30%]，可以生成地心熔浆
// 地表范围在[100%-(1%~3%), 100%]，可以生成生物资源与水与气体资源
// 剩下部分为岩层，可以生成一般矿物
export default class TerraLikeOrb extends Orb {

    readonly coreAltitude: double; // 液态地核高度
    readonly surfaceAltitude: double; // 地表高度，会比总半径小一点

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, mines: Iterable<ResourceItem>, terraLikeOrbData: TerraLikeOrbData) {
        super(world, uid, name, bodyData, mines);
        this.coreAltitude = terraLikeOrbData.coreAltitude;
        this.surfaceAltitude = terraLikeOrbData.surfaceAltitude;
    }

    // override onDrain(miner: Miner): Nullable<Item> {
    //     const location = miner.location;
    //     if (!location) return null;
    //     const altitude = this.radius - location.depth;
        
    //     if (type === ResourceTypes.CORE_LAVA) {
    //         if (altitude <= this.coreAltitude) return super.onDrain(miner);
    //         else return null;
    //     }

    //     if ([ResourceTypes.WATER, ResourceTypes.WOOD].indexOf(type) >= 0) {
    //         if (altitude >= this.surfaceAltitude) return super.onDrain(miner);
    //         else return null;
    //     }
        
    //     return super.onDrain(miner);
    // }
}