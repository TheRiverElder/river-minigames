import { int } from "../../../libs/CommonTypes";
import { computeIfAbsent } from "../../../libs/lang/Collections";
import { stringHashCode } from "../../../libs/lang/Constants";
import { randOne, constrains, randInt, rand } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomName } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import ResourceItem from "../item/ResourceItem";
import Orb from "../orb/Orb";
import TerraLikeOrb from "../orb/TerraLikeOrb";
import ResourceType from "../ResourceType";
import World from "../World";
import OrbGenerator, { ORB_NAMES } from "./OrbGenerator";
import { ResourceGenerationData } from "./ResourceGenerationData";

export default class TerraLikeOrbGenerator implements OrbGenerator {

    readonly oreRandom: WeightedRandom<ResourceGenerationData>;

    constructor(datum: Array<ResourceGenerationData>) {
        this.oreRandom = new WeightedRandom(datum.map(d => [d, d.weight]));
    }

    generate(world: World): Orb {
        const uid = world.genOrbUid();
        // const name = randOne(ORB_NAMES);
        const name = randomName();
        const fullInfoName = `${name}#${uid}`;
        const hash = stringHashCode(fullInfoName);

        const random = new PseudoRandom(hash);

        const radius = random.nextFloat(40, 60);
        const v = 4 / 3 * Math.PI * radius * radius * radius;

        const mineGeneratingTimes = constrains(Math.floor(v / 5), 3, 6);
        const mines = new Map<ResourceType, int>();

        const coreAltitude = radius * random.nextFloat(0.10, 0.30);
        const surfaceAltitude = radius * (1 - random.nextFloat(0.01, 0.03));

        for (let i = 0; i < mineGeneratingTimes; i++) {
            const { type, veinSize } = this.oreRandom.random();
            const size = veinSize();
            const value = computeIfAbsent(mines, type, () => 0) + size;
            mines.set(type, value);
        }
        return new TerraLikeOrb(world, world.genOrbUid(), name, {
            radius,
            color: randInt(0, 0x01000000),
            position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
            forward: rand(0, 2 * Math.PI),
            rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, Array.from(mines.entries()).map((args) => new ResourceItem(...args)), {
            coreAltitude,
            surfaceAltitude,
        });
    }
}