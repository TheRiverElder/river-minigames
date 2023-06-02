import ResourceType from "./ResourceType";

export const RESOURCE_TYPE_EMPTY = new ResourceType("empty", 0);

export const RESOURCE_TYPE_WATER = new ResourceType("water", 0, 2);
export const RESOURCE_TYPE_WOOD = new ResourceType("wood", 1, 18);
export const RESOURCE_TYPE_COAL = new ResourceType("coal", 1, 32);
export const RESOURCE_TYPE_IRON_ORE = new ResourceType("iron_ore", 3, 128);
export const RESOURCE_TYPE_IRON = new ResourceType("iron", 10, 1000);
export const RESOURCE_TYPE_COPPER_ORE = new ResourceType("copper_ore", 3, 110);
export const RESOURCE_TYPE_COPPER = new ResourceType("copper", 10, 800);
export const RESOURCE_TYPE_GOLD_ORE = new ResourceType("gold_ore", 2, 800);
export const RESOURCE_TYPE_GOLD = new ResourceType("gold", 2, 4000);
export const RESOURCE_TYPE_URANIUM_ORE = new ResourceType("uranium_ore", 3300);
export const RESOURCE_TYPE_CORE_LAVA = new ResourceType("core_lava", 2, 5000);

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