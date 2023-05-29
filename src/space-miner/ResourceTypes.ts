import ResourceType from "./model/ResourceType";

export const RESOURCE_TYPE_EMPTY = new ResourceType("empty", 0);

export const RESOURCE_TYPE_WATER = new ResourceType("water", 0);
export const RESOURCE_TYPE_WOOD = new ResourceType("wood", 1);
export const RESOURCE_TYPE_COAL = new ResourceType("coal", 1);
export const RESOURCE_TYPE_IRON_ORE = new ResourceType("iron_ore", 2);
export const RESOURCE_TYPE_URANIUM_ORE = new ResourceType("uranium_ore", 3);

export const RESOURCE_TYPES = [
    RESOURCE_TYPE_WATER,
    RESOURCE_TYPE_WOOD,
    RESOURCE_TYPE_COAL,
    RESOURCE_TYPE_IRON_ORE,
    RESOURCE_TYPE_URANIUM_ORE,
];