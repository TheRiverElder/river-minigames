import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Game from "../../Game";
import Profile from "../Profile";
import ResourceType from "../ResourceType";
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
        const resources = location.orb.onDrain(miner);
        if (resources.length > 0) miner.gain(resources);
    }

    override copy(): CollectorPart {
        return new CollectorPart(this.hardness);
    }

}