import { double } from "../../../libs/CommonTypes";
import { constrains } from "../../../libs/math/Mathmatics";
import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";
import { MINER_PART_TYPE_MAIN_CONTROL } from "./MinerPartTypes";

export default class MainControlPart extends MinerPart {

    readonly downSpeed: double;
    finishedCollecting: boolean = false;

    constructor(downSpeed: double) {
        super();
        this.downSpeed = downSpeed;
    }

    get type(): MinerPartType {
        return MINER_PART_TYPE_MAIN_CONTROL;
    }

    override setup(miner: Miner, location: MinerLocation): void {
        this.finishedCollecting = false;
    }

    override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game): void {
        this.move(miner, location, profile, game);
    }

    move(miner: Miner, location: MinerLocation, profile: Profile, game: Game) {
        if (!this.finishedCollecting && (
            miner.energy <= 0 || 
            // location.depth >= location.orb.radius ||
            miner.cargo.inventory.full
        )) this.finishedCollecting = true;

        if (!this.finishedCollecting) {
            const movingEnergyCost = 10;

            const movement = Math.max(0, Math.min(this.downSpeed, miner.energy / movingEnergyCost, location.orb.radius - location.depth));
            miner.frame.mutateEnergy(-movement * movingEnergyCost);
            location.depth += movement;
        } else {
            const upSpeed = this.downSpeed * 2.5;

            location.depth = constrains(location.depth - upSpeed, 0, location.orb.radius);
        }
    }

}