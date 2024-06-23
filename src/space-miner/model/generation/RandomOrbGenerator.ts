import { double } from "../../../libs/CommonTypes";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import Random from "../../../libs/math/Random";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import World from "../global/World";
import Orb from "../orb/Orb";
import OrbGenerator from "./OrbGenerator";

// 生成类地星球，地心有地心熔浆，地表有木材、生物质（未添加）、氵，地幔有各种矿物
export default class RandomOrbGenerator implements OrbGenerator {

    readonly orbRandom: WeightedRandom<OrbGenerator>;

    constructor(datum: Array<[OrbGenerator, double]>) {
        this.orbRandom = new WeightedRandom(datum);
    }

    generate(world: World, random: Random = new PseudoRandom(world.orbUidGenerator.last())): Orb {
        return this.orbRandom.random(random).generate(world, random);
    }
}