import Game from "./Game";
import { repeatRun } from "../libs/lang/Extensions";
import FramePart from "./model/miner/FramePart";
import MainControlPart from "./model/miner/MainControlPart";
import CargoPart from "./model/miner/CargoPart";
import CollectorPart from "./model/miner/CollectorPart";
import Technology from "./model/technology/Technology";
import { int } from "../libs/CommonTypes";
import { peekNullable } from "../libs/lang/Collections";
import MinerRecipe from "./model/assemble/MinerRecipe";
import MinerItem from "./model/item/MinerItem";
import Miner from "./model/miner/Miner";
import { ResourceTypes } from "./model/ResourceTypes";
import OrbMiningLicenceItem from "./model/item/OrbMiningLisenceItem";
import ResourceItem from "./model/item/ResourceItem";
import MinerPartItem from "./model/item/MinerPartItem";
import Recipe, { materialOf } from "./model/assemble/Recipe";
import SimpleRecipe from "./model/assemble/SimpleRecipe";
import SimpleItem from "./model/item/SimpleItem";

export function initializeTestGame() {
    const game = new Game();

    game.world.mineTypes.addAll(Object.values(ResourceTypes));
    game.itemTypes.addAll([
        OrbMiningLicenceItem.TYPE,
        MinerItem.TYPE,
        MinerPartItem.TYPE,
        ResourceItem.TYPE,
        SimpleItem.TYPE,
    ]);

    game.profile.account = 10000000;

    repeatRun(() => game.discoverAndUpdateShop(), 3);
    
    game.shop.refreshGoods(game);

    createTechnologies().forEach(tech => game.technologies.add(tech));
    game.recipes.add(new MinerRecipe());
    createRecipes().forEach(it => game.recipes.add(it));

    game.profile.warehouse.add(new MinerItem(new Miner({
        frame: new FramePart(100, 100000, 100000),
        mainControl: new MainControlPart(0.12),
        cargo: new CargoPart(10000),
        collector: new CollectorPart(ResourceTypes.CORE_LAVA, 2),
        additions: [],
    })));

    return game;
}

function createTechnologies() {
    const highTemeperatureStorageSeries = createSeriesTechnology("high_temeperature_storage", 3);
    const coolingSeries = createSeriesTechnology("cooling", 3);
    const uraniumProcessingSeries = createSeriesTechnology("uranium_processing", 2);
    const shuntingByDensity = new Technology("shunting_by_density");
    const nuclearFuelRod1 = new Technology("nuclear_fuel_rod", 1, [shuntingByDensity, uraniumProcessingSeries[0]]);
    const nuclearFuelRod2 = new Technology("nuclear_fuel_rod", 2, [nuclearFuelRod1, uraniumProcessingSeries[1]]);
    const reduction = new Technology("reduction");
    const spaceFoldingSeries = createSeriesTechnology("space_folding", 2);

    return [
        ...highTemeperatureStorageSeries,
        ...coolingSeries,
        ...uraniumProcessingSeries,
        nuclearFuelRod1, nuclearFuelRod2,
        ...spaceFoldingSeries,
        shuntingByDensity,
        reduction,
    ];
}

function createSeriesTechnology(name: string, maxLevel: int): Array<Technology> {
    const series: Array<Technology> = [];
    for (let level = 1; level <= maxLevel; level++) {
        const prior = peekNullable(series);
        const priors = prior ? [prior] : [];
        const technology = new Technology(name, level, priors);
        series.push(technology);
    }
    return series;
}

function createRecipes(): Array<Recipe> {

    const smeltingMachineMaterial = materialOf(new SimpleItem("smelting_machine"), false);
    const assemblingMachineMaterial = materialOf(new SimpleItem("assembling_machine"), false);
    const stablizingMachineMaterial = materialOf(new SimpleItem("stablizing_machine"), false);

    return [
        // 无需任何条件的配方
        new SimpleRecipe("gold", new ResourceItem(ResourceTypes.GOLD, 1000), [
            smeltingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),

        // 熔炼配方
        new SimpleRecipe("gold", new ResourceItem(ResourceTypes.GOLD, 1000), [
            smeltingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),
        new SimpleRecipe("iron", new ResourceItem(ResourceTypes.IRON, 1000), [
            smeltingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.IRON_ORE, 2500)),
        ]),
        new SimpleRecipe("copper", new ResourceItem(ResourceTypes.COPPER, 1000), [
            smeltingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.COPPER_ORE, 2000)),
        ]),

        // 处理机器
        new SimpleRecipe("smelting_machine", smeltingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.ROCK, 2000)),
        ]),
        new SimpleRecipe("assembling_machine", assemblingMachineMaterial.item, [
            smeltingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.ROCK, 2000)),
        ]),
        new SimpleRecipe("stablizing_machine", stablizingMachineMaterial.item, [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.IRON, 2000)),
            materialOf(new ResourceItem(ResourceTypes.COPPER, 2000)),
            materialOf(new SimpleItem("cpu", 20)),
        ]),

        // 基础部件
        new SimpleRecipe("cpu", new SimpleItem("cpu", 1), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD, 20)),
            materialOf(new ResourceItem(ResourceTypes.COPPER, 20)),
        ]),

        // 高级部件
        new SimpleRecipe("stable_black_hole", new SimpleItem("stable_black_hole", 1), [
            stablizingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 2000)),
            materialOf(new SimpleItem("neutron", 2000)),
        ]),
        
        // 实用物品
        new SimpleRecipe("stable_black_hole", new SimpleItem("stable_black_hole", 1), [
            stablizingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 2000)),
            materialOf(new SimpleItem("neutron", 2000)),
        ]),

    ];
}