import { double } from "../../../libs/CommonTypes";
import { constrains } from "../../../libs/math/Mathmatics";
import MinerPart from "./MinerPart"
import MinerPartType from "./MinerPartType"
import { MINER_PART_TYPE_FRAME } from "./MinerPartTypes"

export default class FramePart extends MinerPart {

    override get type(): MinerPartType {
        return MINER_PART_TYPE_FRAME;
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

}