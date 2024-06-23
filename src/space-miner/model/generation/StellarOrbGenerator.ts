import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomNameAlphabet } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import World from "../global/World";
import Orb from "../orb/Orb";
import StellarOrb from "../orb/StellarOrb";
import OrbGenerator from "./OrbGenerator";

// 生成恒星，恒星只有一种资源：等离子熔浆，并且温度极高
export default class StellarOrbGenerator implements OrbGenerator {

    generate(world: World): Orb {
        const uid = world.genOrbUid();

        const random = new PseudoRandom(uid);

        const name = randomNameAlphabet(random);

        const radius = random.nextFloat(2000, 9000);
        // const v = 4 / 3 * Math.PI * radius * radius * radius;

        // const mines = new Map<ResourceType, int>([
        //     [ResourceTypes.PLASMA_LAVA, random.nextFloat(1e9, 5e11)],
        // ]);
        const plasmaLavaAmount = random.nextFloat(1e9, 5e11);

        return new StellarOrb(world, uid, name, {
            radius,
            color: random.nextInt(0, 0x01000000),
            position: new Vector2(random.nextFloat(-500, +500), random.nextFloat(-500, +500)),
            rotation: random.nextFloat(0, 2 * Math.PI),
            rotationSpeed: random.nextFloat(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: random.nextFloat(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, plasmaLavaAmount);
    }
}