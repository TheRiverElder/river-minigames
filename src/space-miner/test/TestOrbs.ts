import { sumBy } from "../../libs/lang/Collections";
import { rand, TWO_PI } from "../../libs/math/Mathmatics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Vector2 from "../../libs/math/Vector2";
import WeightedRandom from "../../libs/math/WeightedRandom";
import Game from "../Game";
import RandomOrbGenerator from "../model/generation/RandomOrbGenerator";
import { ResourceGenerationData } from "../model/generation/ResourceGenerationData";
import TerraLikeOrbGenerator from "../model/generation/TerraLikeOrbGenerator";
import ResourceItem from "../model/item/ResourceItem";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import TerraLikeOrb, { TerraLikeOrbLayer } from "../model/orb/TerraLikeOrb";

export function createOrbs(game: Game) {

    const uid = game.world.genOrbUid();

    const random = new PseudoRandom(uid);

    const radius = random.nextFloat(2000, 9000);

    const layers: Array<TerraLikeOrbLayer> = [];

    let layerAltitude = 0;
    { // 生成地心熔岩
        const thickness = 0.3 * radius;
        const mineral = new ResourceItem(game, ResourceTypes.CORE_LAVA, random.nextFloat(80, 150) * 1e9);
        layers.push({
            type: TerraLikeOrb.LAYER_CORE,
            altitude: 0,
            resources: [mineral],
        });
        layerAltitude = thickness;
    }

    { // 生成地幔矿物

        const resourceData: Array<ResourceGenerationData> = [
            { type: ResourceTypes.ROCK, weight: 200, veinSize: () => rand(80, 120) * 1e10 },
            { type: ResourceTypes.STRUCTIUM_ORE, weight: 150, veinSize: () => rand(200, 300) * 1e9 },
            { type: ResourceTypes.SILVER_ORE, weight: 80, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.GOLD_ORE, weight: 50, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.URANIUM_ORE, weight: 50, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.RESONATING_CRYSTAL, weight: 20, veinSize: () => rand(30, 80) * 1e9 },
        ];
        const factor = resourceData.length / sumBy(resourceData, it => it.weight);

        const thickness = 0.6 * radius;
        const resources: Array<ResourceItem> = [];
        for (const rd of resourceData) {
            const size = rd.veinSize() * rd.weight * factor;
            const mineral = new ResourceItem(game, rd.type, size);
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

        const resourceData: Array<ResourceGenerationData> = [
            { type: ResourceTypes.ROCK, weight: 180, veinSize: () => rand(80, 120) * 1e10 },
            { type: ResourceTypes.WATER, weight: 50, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.WOOD, weight: 3, veinSize: () => rand(150, 250) * 1e9 },
            { type: ResourceTypes.BIOMASS, weight: 10, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.COAL, weight: 70, veinSize: () => rand(450, 550) * 1e9 },
            { type: ResourceTypes.STRUCTIUM_ORE, weight: 50, veinSize: () => rand(200, 300) * 1e9 },
            { type: ResourceTypes.SILVER_ORE, weight: 10, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.GOLD_ORE, weight: 5, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.URANIUM_ORE, weight: 2, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.RESONATING_CRYSTAL, weight: 3, veinSize: () => rand(30, 80) * 1e9 },
        ];
        const factor = resourceData.length / sumBy(resourceData, it => it.weight);

        const thickness = 0.05 * radius;
        const resources: Array<ResourceItem> = [];
        for (const rd of resourceData) {
            const size = rd.veinSize() * rd.weight * factor;
            const mineral = new ResourceItem(game, rd.type, size);
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

        const resourceData: Array<ResourceGenerationData> = [
            { type: ResourceTypes.ROCK, weight: 50, veinSize: () => rand(80, 120) * 1e10 },
            { type: ResourceTypes.WATER, weight: 150, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.WOOD, weight: 30, veinSize: () => rand(150, 250) * 1e9 },
            { type: ResourceTypes.BIOMASS, weight: 50, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.COAL, weight: 7, veinSize: () => rand(450, 550) * 1e9 },
            { type: ResourceTypes.STRUCTIUM_ORE, weight: 1, veinSize: () => rand(200, 300) * 1e9 },
            { type: ResourceTypes.SILVER_ORE, weight: 1, veinSize: () => rand(50, 150) * 1e9 },
            { type: ResourceTypes.GOLD_ORE, weight: 1, veinSize: () => rand(50, 150) * 1e9 },
        ];
        const factor = resourceData.length / sumBy(resourceData, it => it.weight);

        const thickness = 0.05 * radius;
        const resources: Array<ResourceItem> = [];
        for (const rd of resourceData) {
            const size = rd.veinSize() * rd.weight * factor;
            const mineral = new ResourceItem(game, rd.type, size);
            resources.push(mineral);
        }
        layers.push({
            type: TerraLikeOrb.LAYER_SURFACE,
            altitude: layerAltitude,
            resources: resources,
        });
        layerAltitude += thickness;
    }

    const terra = new TerraLikeOrb(game.world, uid, "Terra", {
        radius: 7000,
        color: 0x1177ff,
        position: new Vector2(5e9, 0),
        rotation: 0,
        rotationSpeed: TWO_PI / (10 * 24),
        revolutionSpeed: TWO_PI / (365.25 * 24),
    }, layers);

    return [terra];
}