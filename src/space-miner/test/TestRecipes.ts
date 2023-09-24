import MinerRecipe from "../model/assemble/MinerRecipe";
import Recipe, { materialOf } from "../model/assemble/Recipe";
import SimpleRecipe from "../model/assemble/SimpleRecipe";
import MinerPartItem from "../model/item/MinerPartItem";
import ResourceItem from "../model/item/ResourceItem";
import CargoPart from "../model/miner/CargoPart";
import { ResourceTypes } from "../model/ResourceTypes";

export function createRecipes(): Array<Recipe> {

    const oreProcessingMachineMaterial = materialOf(new ResourceItem(ResourceTypes.ORE_PROCESSING_MACHINE), false);
    const assemblingMachineMaterial = materialOf(new ResourceItem(ResourceTypes.ASSEMBLING_MACHINE), false);
    const stablizingMachineMaterial = materialOf(new ResourceItem(ResourceTypes.STABLIZING_MACHINE), false);
    const collapsingMachineMaterial = materialOf(new ResourceItem(ResourceTypes.COLLAPSING_MACHINE), false);

    return [
        // 无需任何条件的配方
        new SimpleRecipe(new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),

        // 熔炼配方
        new SimpleRecipe(new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 8000)),
        ]),
        new SimpleRecipe(new ResourceItem(ResourceTypes.STRUCTIUM, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM_ORE, 2500)),
        ]),
        new SimpleRecipe(new ResourceItem(ResourceTypes.SILVER, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.SILVER_ORE, 2500)),
        ]),
        new SimpleRecipe(new ResourceItem(ResourceTypes.GOLD, 1000), [
            oreProcessingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD_ORE, 2500)),
        ]),

        // 处理机器
        new SimpleRecipe(oreProcessingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.ROCK, 2000)),
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM_ORE, 2000)),
        ]),
        new SimpleRecipe(assemblingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 100)),
            materialOf(new ResourceItem(ResourceTypes.SILVER, 50)),
        ]),
        new SimpleRecipe(collapsingMachineMaterial.item, [
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 500)),
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 300)),
            materialOf(new ResourceItem(ResourceTypes.MACRO_CPU, 50)),
        ]),

        // 基础部件
        new SimpleRecipe(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 1), [
            materialOf(new ResourceItem(ResourceTypes.STRUCTIUM, 20)),
        ]),
        new SimpleRecipe(new ResourceItem(ResourceTypes.MACRO_CPU, 1), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.GOLD, 20)),
            materialOf(new ResourceItem(ResourceTypes.SILVER, 20)),
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 5)),
        ]),

        // 高级部件
        new SimpleRecipe(new ResourceItem(ResourceTypes.BLACK_HOLE, 1), [
            stablizingMachineMaterial,
            collapsingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PLASMA_LAVA, 2000000)),
            materialOf(new ResourceItem(ResourceTypes.CORE_LAVA, 1000000)),
            materialOf(new ResourceItem(ResourceTypes.NEUTRON, 100)),
        ]),
        
        // 实用物品
        new SimpleRecipe(new MinerPartItem(new CargoPart(1000)), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 2000)),
        ]),
        new SimpleRecipe(new MinerPartItem(new CargoPart(5000)), [
            assemblingMachineMaterial,
            materialOf(new ResourceItem(ResourceTypes.PRIMATIVE_SHELL_MODULO, 18000)),
        ]),

        new MinerRecipe(),
    ];
}