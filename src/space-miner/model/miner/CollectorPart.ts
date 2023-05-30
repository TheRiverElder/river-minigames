import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Orb from "../Orb";
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

    readonly mineableResourceType: ResourceType;
    readonly strength: double;

    constructor(mineableResourceType: ResourceType, strength: double) {
        super();
        this.mineableResourceType = mineableResourceType;
        this.strength = strength;
    }

    override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
        this.collect(miner, location, profile, game);
    }

    collect(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {

    }

}