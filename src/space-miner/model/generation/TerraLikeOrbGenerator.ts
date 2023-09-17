import { double, int, Pair } from "../../../libs/CommonTypes";
import { computeIfAbsent } from "../../../libs/lang/Collections";
import { constrains, rand } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomName } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import ResourceItem from "../item/ResourceItem";
import Orb from "../orb/Orb";
import TerraLikeOrb, { TerraLikeOrbLayer } from "../orb/TerraLikeOrb";
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

        const layers: Array<TerraLikeOrbLayer> = [];

        let layerAltitude = 0;
        { // 生成地心熔岩
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            const mineral = new ResourceItem(ResourceTypes.CORE_LAVA, random.nextFloat(80, 150) * 1e9);
            layers.push({
                type: TerraLikeOrb.LAYER_CORE,
                altitude: 0,
                resources: [mineral],
            });
            layerAltitude = thickness;
        }

        { // 生成地幔矿物
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            const resources: Array<ResourceItem> = [];
            for (let i = 0; i < 12; i++) {
                const { type, veinSize } = this.oreRandom.random(random);
                const size = veinSize();
                const mineral = new ResourceItem(type, size);
                resources.push(mineral);
            }
            layers.push({
                type: TerraLikeOrb.LAYER_MANTLE,
                altitude: layerAltitude,
                resources: resources,
            });
            layerAltitude += thickness;
        }

        { // 生成地壳矿物
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            const resources: Array<ResourceItem> = [];
            for (let i = 0; i < 8; i++) {
                const { type, veinSize } = this.oreRandom.random(random);
                const size = veinSize() * 0.1;
                const mineral = new ResourceItem(type, size);
                resources.push(mineral);
            }
            layers.push({
                type: TerraLikeOrb.LAYER_CRUST,
                altitude: layerAltitude,
                resources: resources,
            });
            layerAltitude += thickness;
        }

        { // 生成地表矿物
            const thickness = random.nextFloat(0.8, 1.2) * 0.1 * radius;
            const resources: Array<ResourceItem> = [];
            for (let i = 0; i < 3; i++) {
                const { type, veinSize } = this.oreRandom.random(random);
                const size = veinSize() * 0.005;
                const mineral = new ResourceItem(type, size);
                resources.push(mineral);
            }
            layers.push({
                type: TerraLikeOrb.LAYER_SURFACE,
                altitude: layerAltitude,
                resources: resources,
            });
            layerAltitude += thickness;
        }

        

        return new TerraLikeOrb(world, uid, name, {
            radius,
            color: random.nextInt(0, 0x01000000),
            position: new Vector2(random.nextInt(-500, +500), random.nextInt(-500, +500)),
            rotation: random.nextFloat(0, 2 * Math.PI),
            rotationSpeed: random.nextFloat(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: random.nextFloat(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, layers);
    }
}