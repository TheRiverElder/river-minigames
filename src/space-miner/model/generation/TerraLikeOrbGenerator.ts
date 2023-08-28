import { double, int, Pair } from "../../../libs/CommonTypes";
import { computeIfAbsent } from "../../../libs/lang/Collections";
import { constrains, rand } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomName } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import ResourceItem from "../item/ResourceItem";
import Orb from "../orb/Orb";
import TerraLikeOrb from "../orb/TerraLikeOrb";
import ResourceType from "../ResourceType";
import { ResourceTypes } from "../ResourceTypes";
import World from "../World";
import OrbGenerator from "./OrbGenerator";
import { ResourceGenerationData } from "./ResourceGenerationData";

// 生成类地星球，地心有地心熔浆，地表有木材、生物质（未添加）、氵，地幔有各种矿物
export default class TerraLikeOrbGenerator implements OrbGenerator {

    readonly oreRandom: WeightedRandom<ResourceGenerationData>;

    constructor(datum: Array<ResourceGenerationData>) {
        this.oreRandom = new WeightedRandom(datum.map(d => [d, d.weight]));
    }

    generate(world: World): Orb {
        const uid = world.genOrbUid();

        const random = new PseudoRandom(uid);

        // const name = randOne(ORB_NAMES);
        const name = randomName(random);

        const radius = random.nextFloat(40, 60);
        const v = 4 / 3 * Math.PI * radius * radius * radius;

        const mines: Array<Pair<ResourceItem, double>> = [];

        let mineralRadius = 0;
        { // 生成地心熔岩
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            mineralRadius += thickness;
            const mineral = new ResourceItem(ResourceTypes.CORE_LAVA, random.nextFloat(80, 150) * 1e9);
            mines.push([mineral, mineralRadius]);
        }
        let fuse = 0;
        while (mineralRadius < radius && (fuse++) < 32) {
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            mineralRadius += thickness;
            const { type, veinSize } = this.oreRandom.random(random);
            const size = veinSize();
            const mineral = new ResourceItem(type, size);
            mines.push([mineral, mineralRadius]);
        }

        return new TerraLikeOrb(world, uid, name, {
            radius,
            color: random.nextInt(0, 0x01000000),
            position: new Vector2(random.nextInt(-500, +500), random.nextInt(-500, +500)),
            forward: random.nextFloat(0, 2 * Math.PI),
            rotationSpeed: random.nextFloat(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: random.nextFloat(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, mines);
    }
}