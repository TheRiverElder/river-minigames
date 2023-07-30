import { double } from "../../../libs/CommonTypes";
import { constrains } from "../../../libs/math/Mathmatics";
import Game from "../../Game";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_FRAME } from "./MinerPartTypes"

export default class FramePart extends MinerPart {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_FRAME;
    }

    protected override get descriptionArgs(): any {
        return {
            "size": this.size,
            "energy": this.energy,
            "max_energy": this.maxEnergy,
        };
    }

    readonly size: double;
    readonly maxEnergy: double;
    energy: double;

    constructor(size: double, maxEnergy: double, energy: double = 0) {
        super();
        this.size = size;
        this.maxEnergy = maxEnergy;
        this.energy = energy;
    }

    // 返回实际的改变量
    mutateEnergy(delta: double) {
        const d = constrains(delta, -this.energy, this.maxEnergy - this.energy);
        this.energy += d;
        return d;
    }

    // 返程的时候free为true
    // 返回实际移动的距离
    move(miner: Miner, location: MinerLocation, deltaDepth: double, free: boolean, profile: Profile, game: Game): double {
        if (deltaDepth === 0 || (!free && miner.energy <= 0)) return 0;

        const movingEnergyCost = 10;
        const restDepth = deltaDepth > 0 ? (location.orb.radius - location.depth) : (location.depth);

        let movement = 0;
        if (!free) {
            const restDepthThatRestEnergySupport = miner.energy / movingEnergyCost;
            movement = Math.max(0, Math.min(Math.abs(deltaDepth), restDepthThatRestEnergySupport, restDepth));
            miner.frame.mutateEnergy(-movement * movingEnergyCost);
        } else {
            movement = Math.max(0, Math.min(Math.abs(deltaDepth), restDepth));
        }

        location.depth = constrains(location.depth + Math.sign(deltaDepth) * movement, 0, location.orb.radius);
        return movement;
    }

}