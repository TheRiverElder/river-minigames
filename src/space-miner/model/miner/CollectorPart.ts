import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Game from "../../Game";
import Profile from "../Profile";
import ResourceType from "../ResourceType";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_COLLECTOR } from "./MinerPartTypes"

export default class CollectorPart extends MinerPart {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_COLLECTOR;
    }

    protected override get descriptionArgs(): any {
        return {
            "mineable_resource_type": new I18nText(`resource_type.${this.mineableResourceType.name}`),
        };
    }

    readonly mineableResourceType: ResourceType;
    readonly strength: double;

    constructor(mineableResourceType: ResourceType, strength: double) {
        super();
        this.mineableResourceType = mineableResourceType;
        this.strength = strength;
    }

    // override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
    //     this.collect(miner, location, profile, game);
    // }

    collect(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
        const resource = location.orb.onDrain(this.mineableResourceType, miner);
        if (resource) miner.gain([resource]);
    }

}