import ResourceType from "./ResourceType";

export const RESOURCE_TYPE_EMPTY = new ResourceType("empty", 0);

export const RESOURCE_TYPE_WATER = new ResourceType("water", 0);
export const RESOURCE_TYPE_WOOD = new ResourceType("wood", 1);
export const RESOURCE_TYPE_COAL = new ResourceType("coal", 1);
export const RESOURCE_TYPE_IRON_ORE = new ResourceType("iron_ore", 3);
export const RESOURCE_TYPE_IRON = new ResourceType("iron", 10);
export const RESOURCE_TYPE_COPPER_ORE = new ResourceType("copper_ore", 3);
export const RESOURCE_TYPE_COPPER = new ResourceType("copper", 10);
export const RESOURCE_TYPE_GOLD_ORE = new ResourceType("gold_ore", 2);
export const RESOURCE_TYPE_GOLD = new ResourceType("gold", 2);
export const RESOURCE_TYPE_URANIUM_ORE = new ResourceType("uranium_ore", 3);
export const RESOURCE_TYPE_CORE_LAVA = new ResourceType("core_lava", 2);

export const RESOURCE_TYPES = [
    RESOURCE_TYPE_WATER,
    RESOURCE_TYPE_WOOD,
    RESOURCE_TYPE_COAL,
    RESOURCE_TYPE_IRON_ORE,
    RESOURCE_TYPE_IRON,
    RESOURCE_TYPE_IRON_ORE,
    RESOURCE_TYPE_COPPER_ORE,
    RESOURCE_TYPE_COPPER,
    RESOURCE_TYPE_GOLD_ORE,
    RESOURCE_TYPE_GOLD,
    RESOURCE_TYPE_URANIUM_ORE,
    RESOURCE_TYPE_CORE_LAVA,
];

export const NATURAL_RESOURCE_TYPES = [
    RESOURCE_TYPE_WATER,
    RESOURCE_TYPE_WOOD,
    RESOURCE_TYPE_COAL,
    RESOURCE_TYPE_IRON_ORE,
    RESOURCE_TYPE_COPPER_ORE,
    RESOURCE_TYPE_GOLD_ORE,
    RESOURCE_TYPE_URANIUM_ORE,
    RESOURCE_TYPE_CORE_LAVA,
];