import { double, int } from "../../../libs/CommonTypes";
import { peek, sortBy } from "../../../libs/lang/Collections";
import { checkLessThan, constrains } from "../../../libs/math/Mathmatics";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import BonusPackItem from "../item/BonusPackItem";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import CollectorPart from "../miner/CollectorPart";
import World from "../World";
import Orb, { InOrbLocation, OrbBodyData } from "./Orb";

export interface TerraLikeOrbLayerType {
    name: string;
    ordinal: int;
}

export interface TerraLikeOrbLayer {
    type: TerraLikeOrbLayerType;
    altitude: double; // 该层上限
    resources: Array<ResourceItem>;
}

export default class TerraLikeOrb extends Orb {

    static readonly LAYER_CORE: TerraLikeOrbLayerType = { name: "core", ordinal: 0 };
    static readonly LAYER_MANTLE: TerraLikeOrbLayerType = { name: "mantle", ordinal: 1 };
    static readonly LAYER_CRUST: TerraLikeOrbLayerType = { name: "crust", ordinal: 2 };
    static readonly LAYER_SURFACE: TerraLikeOrbLayerType = { name: "surface", ordinal: 3 };
    static readonly LAYERS = [TerraLikeOrb.LAYER_SURFACE, TerraLikeOrb.LAYER_CRUST, TerraLikeOrb.LAYER_MANTLE, TerraLikeOrb.LAYER_CORE];

    readonly layers: Array<TerraLikeOrbLayer>;

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, layers: Array<TerraLikeOrbLayer>) {
        super(world, uid, name, bodyData);
        this.layers = sortBy(layers, it => it.type.ordinal);
    }

    override onDrain(collector: CollectorPart, requiringAmount: double, location: InOrbLocation): Array<Item> {
        const position = constrains(this.body.radius - location.depth, 0, this.body.radius);
        const layer = this.isInWitchLevel(location.depth);
        const result: Array<Item> = [];

        const maxAmount = requiringAmount;
        let tokenAmount = 0;
        while (tokenAmount < maxAmount) {
            const random = new WeightedRandom(layer.resources.map(it => [it, it.amount]))
            const resource = random.random();
            const packAmount = Math.min(maxAmount - tokenAmount, resource.amount);
            if (packAmount <= 0) break;
            if (!collector.canCollect(new ResourceItem(this.world.game, resource.resourceType, packAmount))) break;
            const pack = resource.take(packAmount);
            result.push(pack);
            tokenAmount += packAmount;
        }

        if ((layer.type === TerraLikeOrb.LAYER_SURFACE || layer.type === TerraLikeOrb.LAYER_CRUST) && checkLessThan(1 / (2000 * 1))) {
            result.push(new BonusPackItem(this.world.game, 1));
        }

        return result;
    }

    // override getMineralList(): Array<Item> {
    //     return Array.from(groupBy(this.mines.map(it => it[0]), it => it.resourceType).entries())
    //         .map(([type, items]) => new ResourceItem(type, sumBy(items, it => it.amount)));
    // }

    isInWitchLevel(depth: double): TerraLikeOrbLayer {
        const altitude = this.body.radius - depth;
        for (const layer of this.layers) { // 从地心到地表匹配
            if (altitude <= layer.altitude) return layer;
        } 
        return peek(this.layers);
    }
}