import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_COLLECTOR } from "./MinerPartTypes"

export default class CollectorPart extends MinerPart<CollectorPart> {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_COLLECTOR;
    }

    protected override get descriptionArgs(): any {
        return {
            "hardness": this.hardness,
        };
    }

    // readonly mineableResourceType: ResourceType;
    readonly hardness: double;
    readonly endurableTemperature: double;
    readonly accactableTags: Array<string>;

    constructor(strength: double, endurableTemperature: double, accactableTags: Array<string>) {
        super();
        // this.mineableResourceType = mineableResourceType;
        this.hardness = strength;
        this.endurableTemperature = endurableTemperature;
        this.accactableTags = accactableTags.slice();
    }

    // override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
    //     this.collect(miner, location, profile, game);
    // }

    collect(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
        const resources = location.orb.onDrain(miner, location);
        if (resources.length > 0) miner.gain(resources);
    }

    canCollect(item: ResourceItem): boolean {
        const type = item.resourceType;
        if (this.hardness < type.hardness) return false;
        if (!this.accactableTags.some(it => type.tags.has(it))) return false;
        if (type.temperature > this.endurableTemperature) return false;
        return true;
    }

    override copy(): CollectorPart {
        return new CollectorPart(this.hardness, this.endurableTemperature, this.accactableTags);
    }

    override equals(another: MinerPart): boolean {
        return another instanceof CollectorPart && another.hardness === this.hardness;
    }

}