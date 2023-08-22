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
        collector: new CollectorPart(2),
        additions: [],
    })));

    {
        const orb = game.spaceExploringCenter.getUnclaimedOrbs(game.world)[0];
        game.actions.claimOrb(orb, game.profile);
        game.actions.deploy(orb, [game.profile.warehouse.items[0] as MinerItem], game.profile);
    }

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

    const oreProcessingMachineMaterial = materialOf(new SimpleItem("ore_processing_machine"), false);
    const assemblingMachineMaterial = materialOf(new SimpleItem("assembling_machine"), false);
    const stablizingMachineMaterial = materialOf(new SimpleItem("stablizing_machine"), false);
    const collapsingMachineMaterial = materialOf(new SimpleItem("collapsing_machine"), false);

    return [
        // 无需任何条件的配方
        new SimpleRecipe("gold", new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),

        // 熔炼配方
        new SimpleRecipe("gold", new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),
        new SimpleRecipe("structium", new ResourceItem(ResourceTypes.STRUCTIUM, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM_ORE, 2500)),
        ]),
        new SimpleRecipe("silver", new ResourceItem(ResourceTypes.SILVER, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.SILVER_ORE, 2500)),
        ]),
        new SimpleRecipe("gold", new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 2500)),
        ]),

        // 处理机器
        new SimpleRecipe("ore_processing_machine", oreProcessingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.ROCK, 2000)),
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM_ORE, 2000)),
        ]),
        new SimpleRecipe("assembling_machine", assemblingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 100)),
            materialOf(new ResourceItem(ResourceTypes.SILVER, 50)),
        ]),
        new SimpleRecipe("collapsing_machine", collapsingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 500)),
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 300)),
            materialOf(new ResourceItem(ResourceTypes.MACRO_CPU, 50)),
        ]),

        // 基础部件
        new SimpleRecipe("primative_shell_modulo", new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 1), [
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM, 20)),
        ]),
        new SimpleRecipe("macro_cpu", new ResourceItem(ResourceTypes.MACRO_CPU, 1), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD, 20)),
            materialOf(new ResourceItem(ResourceTypes.SILVER, 20)),
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 5)),
        ]),

        // 高级部件
        new SimpleRecipe("black_hole", new ResourceItem(ResourceTypes.BLACK_HOLE, 1), [
            stablizingMachineMaterial,
            collapsingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 2000000)),
            materialOf(new ResourceItem(ResourceTypes.CORE_LAVA, 1000000)),
            materialOf(new ResourceItem(ResourceTypes.NEUTRON, 100)),
        ]),
        
        // 实用物品
        new SimpleRecipe("normal_cargo_lvl_1", new MinerPartItem(new CargoPart(1000)), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 2000)),
        ]),
        new SimpleRecipe("normal_cargo_lvl_2", new MinerPartItem(new CargoPart(5000)), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 18000)),
        ]),

    ];
}