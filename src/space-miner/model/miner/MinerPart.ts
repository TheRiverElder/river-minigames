import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPartType from "./MinerPartType";

export default abstract class MinerPart {
    
    abstract get type(): MinerPartType;

    tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game) { }

}