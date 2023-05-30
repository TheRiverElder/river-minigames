import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";
import { MINER_PART_TYPE_MAIN_CONTROL } from "./MinerPartTypes";

export default class MainControlPart extends MinerPart {

    get type(): MinerPartType {
        return MINER_PART_TYPE_MAIN_CONTROL;
    }

    override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game): void {
        
    }

    move(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {

    }

}