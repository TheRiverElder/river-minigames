import { double, int, Pair, Productor } from "../../../libs/CommonTypes";
import { computeIfAbsent, sortBy } from "../../../libs/lang/Collections";
import { constrains, rand, TWO_PI } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
import { randomNameAlphabet } from "../../../libs/math/RandomName";
import Vector2 from "../../../libs/math/Vector2";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import ResourceItem from "../item/ResourceItem";
import Orb from "../orb/Orb";
import TerraLikeOrb, { TerraLikeOrbLayer, TerraLikeOrbLayerType } from "../orb/TerraLikeOrb";
import ResourceType from "../misc/ResourceType";
import { ResourceTypes } from "../misc/ResourceTypes";
import World from "../World";
import OrbGenerator from "./OrbGenerator";
import { ResourceGenerationData } from "./ResourceGenerationData";
import Random from "../../../libs/math/Random";
import { randomOrbName } from "./RandomOrbName";

export interface TerraLikeOrbGeneratorLayerMetadata {
    layerType: TerraLikeOrbLayerType;
    thicknessRatioGenerator: Productor<Random, number>;
    resourceRandom: WeightedRandom<ResourceGenerationData>;
}

export interface TerraLikeOrbGeneratorMetadata {
    layers: Array<TerraLikeOrbGeneratorLayerMetadata>;
}

// 生成类地星球，地心有地心熔浆，地表有木材、生物质（未添加）、氵，地幔有各种矿物
export default class TerraLikeOrbGenerator implements OrbGenerator {

    readonly metadata: TerraLikeOrbGeneratorMetadata;

    constructor(metadata: TerraLikeOrbGeneratorMetadata) {
        this.metadata = {
            layers: sortBy(metadata.layers, it => it.layerType.ordinal),
        };
    }

    generate(world: World): Orb {
        const uid = world.genOrbUid();

        const random = new PseudoRandom(uid);

        // const name = randOne(ORB_NAMES);
        const name = (random.nextFloat(0, 1) < 0.5) ? randomOrbName(random) : randomNameAlphabet(random);

        const radius = random.nextFloat(2000, 9000);

        const layers: Array<TerraLikeOrbLayer> = [];

        let layerAltitude = 0;
        for (const layerMetadata of this.metadata.layers) {
            const { layerType, thicknessRatioGenerator, resourceRandom } = layerMetadata;

            const thickness = thicknessRatioGenerator(random) * radius;
            const resources: Array<ResourceItem> = [];
            for (let i = 0; i < 8; i++) {
                const { type, veinSize } = resourceRandom.random(random);
                const size = veinSize();
                const mineral = new ResourceItem(world.game, type, size);
                resources.push(mineral);
            }
            layers.push({
                type: layerType,
                altitude: layerAltitude,
                resources: resources,
            });
            layerAltitude += thickness;
        }

        return new TerraLikeOrb(world, uid, name, {
            radius,
            color: random.nextInt(0, 0x01000000),
            position: Vector2.fromPolar(random.nextFloat(0, TWO_PI), random.nextFloat(1e9, 10e9)),
            rotation: random.nextFloat(0, 2 * Math.PI),
            rotationSpeed: random.nextFloat(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: random.nextFloat(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, layers);
    }
}