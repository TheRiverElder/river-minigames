import ResourceType from "./ResourceType";

export const ResourceTypes = {
    EMPTY: new ResourceType("empty", 0),
    WATER: new ResourceType("water", 0, 2),
    WOOD: new ResourceType("wood", 1, 18),
    COAL: new ResourceType("coal", 1, 32),
    IRON_ORE: new ResourceType("iron_ore", 3, 128),
    IRON: new ResourceType("iron", 10, 1000),
    COPPER_ORE: new ResourceType("copper_ore", 3, 110),
    COPPER: new ResourceType("copper", 10, 800),
    GOLD_ORE: new ResourceType("gold_ore", 2, 800),
    GOLD: new ResourceType("gold", 2, 4000),
    URANIUM_ORE: new ResourceType("uranium_ore", 4, 3300),
    URANIUM_238: new ResourceType("uranium_238", 4, 3300),
    URANIUM_235: new ResourceType("uranium_235", 4, 3300),
    CORE_LAVA: new ResourceType("core_lava", 2, 5000),
    PLASMA_LAVA: new ResourceType("plasma_lava", 2, 8000),
    METALLIC_HYTROGEN: new ResourceType("metallic_hydrogen", 2, 16000),
};

export const NATURAL_RESOURCE_TYPES = [
    ResourceTypes.WATER,
    ResourceTypes.WOOD,
    ResourceTypes.COAL,
    ResourceTypes.IRON_ORE,
    ResourceTypes.COPPER_ORE,
    ResourceTypes.GOLD_ORE,
    ResourceTypes.URANIUM_ORE,
    ResourceTypes.CORE_LAVA,
    ResourceTypes.PLASMA_LAVA,
    ResourceTypes.METALLIC_HYTROGEN,
];

export const ARTIFICIAL_RESOURCE_TYPES = [
    ResourceTypes.IRON,
    ResourceTypes.COPPER,
    ResourceTypes.GOLD,
    ResourceTypes.URANIUM_238,
    ResourceTypes.URANIUM_235,
];
