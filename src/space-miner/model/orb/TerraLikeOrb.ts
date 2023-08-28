import { double, int, Pair } from "../../../libs/CommonTypes";
import { groupBy, sumBy } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import { constrains } from "../../../libs/math/Mathmatics";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import Miner, { MinerLocation } from "../miner/Miner";
import World from "../World";
import Orb, { OrbBodyData } from "./Orb";

export interface TerraLikeOrbData {
    coreAltitude: double; // 液态地核高度
    surfaceAltitude: double; // 地表高度，会比总半径小一点
    mines: Array<Pair<ResourceItem, double>>;
}

// 类泰拉星球，有着固体地幔与地壳，液态地核
// 地核范围在[0, 10%~30%]，可以生成地心熔浆
// 地表范围在[100%-(1%~3%), 100%]，可以生成生物资源与水与气体资源
// 剩下部分为岩层，可以生成一般矿物
export default class TerraLikeOrb extends Orb {

    // readonly coreAltitude: double; // 液态地核高度
    // readonly surfaceAltitude: double; // 地表高度，会比总半径小一点
    readonly mines: Array<Pair<ResourceItem, double>>; 

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, mines: Array<Pair<ResourceItem, double>>) {
        super(world, uid, name, bodyData);
        this.mines = mines;
    }

    override onDrain(miner: Miner, location: MinerLocation): Array<Item> {
        const collectorHardness = miner.collector.hardness;
        const position = constrains(this.radius - location.depth, 0, this.radius);
        const result: Array<Item> = [];
        let mineral: Nullable<ResourceItem> = null;
        for (const [currentMineral, radius] of this.mines) {
            if (position <= radius) {
                mineral = currentMineral;
                break;
            }
        }

        if (mineral === null) return [];

        if (mineral.resourceType.hardness > collectorHardness) return [];
    
        const tokenAmount = Math.min((collectorHardness + 1) * 15, mineral.amount);
        const tokenResource = mineral.take(tokenAmount);
        // console.log(removedResource);
        if (tokenResource.amount <= 0) return [];

        result.push(tokenResource);

        return result;
    }

    override getMineralList(): Array<Item> {
        return Array.from(groupBy(this.mines.map(it => it[0]), it => it.resourceType).entries())
            .map(([type, items]) => new ResourceItem(type, sumBy(items, it => it.amount)));
    }
}