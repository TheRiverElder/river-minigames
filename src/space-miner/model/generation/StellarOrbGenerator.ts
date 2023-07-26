import { int } from "../../../libs/CommonTypes";
import { stringHashCode } from "../../../libs/lang/Constants";
import { randInt, rand } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomName } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import ResourceItem from "../item/ResourceItem";
import Orb from "../orb/Orb";
import TerraLikeOrb from "../orb/TerraLikeOrb";
import ResourceType from "../ResourceType";
import { RESOURCE_TYPE_PLASMA_LAVA } from "../ResourceTypes";
import World from "../World";
import OrbGenerator from "./OrbGenerator";

// 生成恒星，恒星只有一种资源：等离子熔浆，并且温度极高
export default class StellarOrbGenerator implements OrbGenerator {
    constructor() {
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

        const mines = new Map<ResourceType, int>([
            [RESOURCE_TYPE_PLASMA_LAVA, rand(1e9, 5e11)],
        ]);

        const coreAltitude = radius * random.nextFloat(0.10, 0.30);
        const surfaceAltitude = radius * (1 - random.nextFloat(0.01, 0.03));

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