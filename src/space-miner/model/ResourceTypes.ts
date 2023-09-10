import { Tags } from "./item/Tags";
import ResourceType from "./ResourceType";

export const ResourceTypes = {
    // 其它
    EMPTY: new ResourceType("empty", 0, 0),
    WATER: new ResourceType("water", 0, 20, [Tags.FLUID]),
    
    // 岩石矿物
    ROCK: new ResourceType("rock", 6, 20, [Tags.SOLID]),
    COAL: new ResourceType("coal", 3, 20, [Tags.SOLID, Tags.FLAMMABLE]),
    PETROLEUM: new ResourceType("petroleum", 1, 20, [Tags.FLUID]),
    STRUCTIUM_ORE: new ResourceType("structium_ore", 3, 20, [Tags.SOLID]),
    SILVER_ORE: new ResourceType("silver_ore", 2, 20, [Tags.SOLID]),
    GOLD_ORE: new ResourceType("gold_ore", 2, 20, [Tags.SOLID]),
    URANIUM_ORE: new ResourceType("uranium_ore", 4, 20, [Tags.SOLID]),
    HIGH_DENSITY_METAL: new ResourceType("high_density_metal", 4, 20, [Tags.SOLID]),

    // 精炼矿物
    STRUCTIUM: new ResourceType("structium", 3, 20, [Tags.SOLID]),
    SILVER: new ResourceType("silver", 2, 20, [Tags.SOLID]),
    GOLD: new ResourceType("gold", 2, 20, [Tags.SOLID]),
    URANIUM_238: new ResourceType("uranium_238", 4, 20, [Tags.SOLID, Tags.RADIATION, Tags.FUSSION_FUEL]),
    URANIUM_235: new ResourceType("uranium_235", 4, 20, [Tags.SOLID, Tags.RADIATION, Tags.FUSSION_FUEL]),
    POLYMER: new ResourceType("polymer", 4, 20, [Tags.SOLID, Tags.FLAMMABLE]),
    
    // 生物
    WOOD: new ResourceType("wood", 1, 20, [Tags.SOLID, Tags.BIOMASS, Tags.FLAMMABLE]),
    BIOMASS: new ResourceType("biomass", 1, 20, [Tags.FLUID, Tags.BIOMASS]),
    
    // 基础物理学
    CORE_LAVA: new ResourceType("core_lava", 2, 5000, [Tags.FLUID]),
    PLASMA_LAVA: new ResourceType("plasma_lava", 2, 8000, [Tags.FLUID]),
    METALLIC_HYTROGEN: new ResourceType("metallic_hydrogen", 2, 3000, [Tags.FLUID]),
    NEUTRON: new ResourceType("neutron", 2, 10000, [Tags.FLUID]),
    BLACK_HOLE: new ResourceType("black_hole", 1, 10000),

    // 精密材料
    MACRO_CPU: new ResourceType("macro_cpu", 1, 20, [Tags.SOLID]),
    MICRO_CPU: new ResourceType("micro_cpu", 1, 20, [Tags.SOLID]),
    QUANTEM_CPU: new ResourceType("quantem_cpu", 1, 20, [Tags.SOLID]),
    PRIMATIVE_SHELL_MODULO: new ResourceType("primative_shell_modulo", 1, 20, [Tags.SOLID]),
    ADVANCED_SHELL_MODULO: new ResourceType("advanced_shell_modulo", 1, 20, [Tags.SOLID]),
    DROP_SHELL_MODULO: new ResourceType("drop_shell_modulo", 1, 20, [Tags.SOLID]),

    // 机器
    ORE_PROCESSING_MACHINE: new ResourceType("ore_processing_machine", 1, 20, [Tags.SOLID]),
    COLLAPSING_MACHINE: new ResourceType("collapsing_machine", 1, 20, [Tags.SOLID]),
    ASSEMBLING_MACHINE: new ResourceType("assembling_machine", 1, 20, [Tags.SOLID]),
    STABLIZING_MACHINE: new ResourceType("stablizing_machine", 1, 20, [Tags.SOLID]),
    
};

export const NATURAL_RESOURCE_TYPES = [
    ResourceTypes.WATER,
    ResourceTypes.WOOD,
    ResourceTypes.ROCK,
    ResourceTypes.COAL,
    ResourceTypes.GOLD_ORE,
    ResourceTypes.URANIUM_ORE,
    ResourceTypes.CORE_LAVA,
    ResourceTypes.PLASMA_LAVA,
    ResourceTypes.METALLIC_HYTROGEN,
];

export const ARTIFICIAL_RESOURCE_TYPES = [
    ResourceTypes.GOLD,
    ResourceTypes.STRUCTIUM,
    ResourceTypes.SILVER,
    ResourceTypes.POLYMER,
    ResourceTypes.GOLD,
    ResourceTypes.URANIUM_238,
    ResourceTypes.URANIUM_235,
    ResourceTypes.MACRO_CPU,
    ResourceTypes.MICRO_CPU,
    ResourceTypes.QUANTEM_CPU,
    ResourceTypes.PRIMATIVE_SHELL_MODULO,
    ResourceTypes.ADVANCED_SHELL_MODULO,
    ResourceTypes.DROP_SHELL_MODULO,
];
