import ResourceType from "./ResourceType";

export const ResourceTypes = {
    // 其它
    EMPTY: new ResourceType("empty", 0),
    WATER: new ResourceType("water", 0, 2),
    
    // 岩石矿物
    ROCK: new ResourceType("rock", 6, 2),
    COAL: new ResourceType("coal", 1, 32),
    PETROLEUM: new ResourceType("petroleum", 1, 32),
    STRUCTIUM_ORE: new ResourceType("structium_ore", 3, 128),
    SILVER_ORE: new ResourceType("silver_ore", 2, 800),
    GOLD_ORE: new ResourceType("gold_ore", 2, 800),
    URANIUM_ORE: new ResourceType("uranium_ore", 4, 3300),
    HIGH_DENSITY_METAL: new ResourceType("high_density_metal", 4, 3300),

    // 精炼矿物
    STRUCTIUM: new ResourceType("structium", 3, 128),
    SILVER: new ResourceType("silver", 2, 4000),
    GOLD: new ResourceType("gold", 2, 4000),
    URANIUM_238: new ResourceType("uranium_238", 4, 3300),
    URANIUM_235: new ResourceType("uranium_235", 4, 3300),
    POLYMER: new ResourceType("polymer", 4, 3300),
    
    // 生物
    WOOD: new ResourceType("wood", 1, 18),
    BIOMASS: new ResourceType("biomass", 1, 18),
    
    // 基础物理学
    CORE_LAVA: new ResourceType("core_lava", 2, 5000),
    PLASMA_LAVA: new ResourceType("plasma_lava", 2, 8000),
    METALLIC_HYTROGEN: new ResourceType("metallic_hydrogen", 2, 16000),
    NEUTRON: new ResourceType("neutron", 2, 16000),
    BLACK_HOLE: new ResourceType("black_hole", 1, 5000),

    // 精密材料
    MACRO_CPU: new ResourceType("macro_cpu", 1, 5000),
    MICRO_CPU: new ResourceType("micro_cpu", 1, 5000),
    QUANTEM_CPU: new ResourceType("quantem_cpu", 1, 5000),
    PRIMATIVE_SHELL_MODULO: new ResourceType("primative_shell_modulo", 1, 5000),
    ADVANCED_SHELL_MODULO: new ResourceType("advanced_shell_modulo", 1, 5000),
    DROP_SHELL_MODULO: new ResourceType("drop_shell_modulo", 1, 5000),

    // 机器
    ORE_PROCESSING_MACHINE: new ResourceType("ore_processing_machine", 1, 5000),
    COLLAPSING_MACHINE: new ResourceType("collapsing_machine", 1, 5000),
    ASSEMBLING_MACHINE: new ResourceType("assembling_machine", 1, 5000),
    STABLIZING_MACHINE: new ResourceType("stablizing_machine", 1, 5000),
    
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
    ResourceTypes.URANIUM_238,
    ResourceTypes.URANIUM_235,
];
