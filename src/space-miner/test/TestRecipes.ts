import Game from "../model/global/Game";
import Recipe, { materialOf } from "../model/assemble/Recipe";
import { SimpleRecipeProps, createSimpleRecipe } from "../model/assemble/SimpleRecipe";
import ResourceItem from "../model/item/ResourceItem";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import FacilityItem from "../model/item/FacilityItem";
import ResearcherFacility from "../model/facility/ResearcherFacility";
import { int } from "../../libs/CommonTypes";
import { some } from "lodash";
import Technology from "../model/technology/Technology";

export function createRecipes(game: Game): Array<Recipe> {

    function createTechChecker(name: string, level: int = 1): SimpleRecipeProps['checkUnlock'] {
        return (recipe) => recipe.game.profile.unlockedTechnologies.has(recipe.game.technologies.getOrThrow(Technology.getRegistryName(name, level)));
    }

    const oreProcessingMachineMaterial = materialOf(new ResourceItem(game, ResourceTypes.ORE_PROCESSING_MACHINE), false);
    const assemblingMachineMaterial = materialOf(new ResourceItem(game, ResourceTypes.ASSEMBLING_MACHINE), false);
    const stablizingMachineMaterial = materialOf(new ResourceItem(game, ResourceTypes.STABLIZING_MACHINE), false);
    const collapsingMachineMaterial = materialOf(new ResourceItem(game, ResourceTypes.COLLAPSING_MACHINE), false);

    return [
        // 无需任何条件的配方
        // 从大量岩石中提取一些矿物
        createSimpleRecipe(game, "simple_rock_ore_extraction", [
            new ResourceItem(game, ResourceTypes.STRUCTIUM_ORE, 5),
            new ResourceItem(game, ResourceTypes.COAL, 10),
            new ResourceItem(game, ResourceTypes.IRON, 10),
        ], [
            new ResourceItem(game, ResourceTypes.ROCK, 100),
        ]),
        // 从铁矿中提炼
        createSimpleRecipe(game, "iron_refine_primary", new ResourceItem(game, ResourceTypes.IRON, 5), [
            new ResourceItem(game, ResourceTypes.IRON_ORE, 10),
        ]),
        // 制造研究室
        createSimpleRecipe(game, "researcher", new FacilityItem(game, ResearcherFacility.TYPE), [
            new ResourceItem(game, ResourceTypes.IRON, 10),
        ]),
        // 分离铀矿
        createSimpleRecipe(game, "uranium_ore_processing", [
            new ResourceItem(game, ResourceTypes.URANIUM_235, 0.5),
            new ResourceItem(game, ResourceTypes.URANIUM_238, 9.5),
        ], [
            new ResourceItem(game, ResourceTypes.URANIUM_ORE, 10),
        ], [], createTechChecker("uranium_processing", 1)),

        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.GOLD, 1000), [
        //     materialOf(new ResourceItem(game, ResourceTypes.GOLD_ORE, 8000)),
        // ]),

        // // 熔炼配方
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.GOLD, 1000), [
        //     oreProcessingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.GOLD_ORE, 8000)),
        // ]),
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.STRUCTIUM, 1000), [
        //     oreProcessingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.STRUCTIUM_ORE, 2500)),
        // ]),
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.SILVER, 1000), [
        //     oreProcessingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.SILVER_ORE, 2500)),
        // ]),
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.GOLD, 1000), [
        //     oreProcessingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.GOLD_ORE, 2500)),
        // ]),

        // // 处理机器
        // new SimpleRecipe(oreProcessingMachineMaterial.item, [
        //     materialOf(new ResourceItem(game, ResourceTypes.ROCK, 2000)),
        //     materialOf(new ResourceItem(game, ResourceTypes.STRUCTIUM_ORE, 2000)),
        // ]),
        // new SimpleRecipe(assemblingMachineMaterial.item, [
        //     materialOf(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 100)),
        //     materialOf(new ResourceItem(game, ResourceTypes.SILVER, 50)),
        // ]),
        // new SimpleRecipe(collapsingMachineMaterial.item, [
        //     materialOf(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 500)),
        //     materialOf(new ResourceItem(game, ResourceTypes.PLASMA_LAVA, 300)),
        //     materialOf(new ResourceItem(game, ResourceTypes.MACRO_CPU, 50)),
        // ]),

        // // 基础部件
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 1), [
        //     materialOf(new ResourceItem(game, ResourceTypes.STRUCTIUM, 20)),
        // ]),
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.MACRO_CPU, 1), [
        //     assemblingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.GOLD, 20)),
        //     materialOf(new ResourceItem(game, ResourceTypes.SILVER, 20)),
        //     materialOf(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 5)),
        // ]),

        // // 高级部件
        // new SimpleRecipe(new ResourceItem(game, ResourceTypes.BLACK_HOLE, 1), [
        //     stablizingMachineMaterial,
        //     collapsingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.PLASMA_LAVA, 2000000)),
        //     materialOf(new ResourceItem(game, ResourceTypes.CORE_LAVA, 1000000)),
        //     materialOf(new ResourceItem(game, ResourceTypes.NEUTRON, 100)),
        // ]),
        
        // // 实用物品
        // new SimpleRecipe(new MinerPartItem(game, new CargoPart(1000)), [
        //     assemblingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 2000)),
        // ]),
        // new SimpleRecipe(new MinerPartItem(game, new CargoPart(5000)), [
        //     assemblingMachineMaterial,
        //     materialOf(new ResourceItem(game, ResourceTypes.PRIMATIVE_SHELL_MODULO, 18000)),
        // ]),

        // new MinerRecipe(game),
    ];
}