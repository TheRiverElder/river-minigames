import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
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

    constructor(strength: double) {
        super();
        // this.mineableResourceType = mineableResourceType;
        this.hardness = strength;
    }

    // override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
    //     this.collect(miner, location, profile, game);
    // }

    collect(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
        const resources = location.orb.onDrain(miner, location);
        if (resources.length > 0) miner.gain(resources);
    }

    override copy(): CollectorPart {
        return new CollectorPart(this.hardness);
    }

    override equals(another: MinerPart): boolean {
        return another instanceof CollectorPart && another.hardness === this.hardness;
    }

}