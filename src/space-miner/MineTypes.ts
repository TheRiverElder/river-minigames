import MineType from "./model/MineType";

export const MINE_TYPE_WATER = new MineType("water", 0);
export const MINE_TYPE_WOOD = new MineType("wood", 1);
export const MINE_TYPE_COAL = new MineType("coal", 1);
export const MINE_TYPE_IRON_ORE = new MineType("iron_ore", 2);
export const MINE_TYPE_URANIUM_ORE = new MineType("uranium_ore", 3);

export const MINE_TYPES = [
    MINE_TYPE_WATER,
    MINE_TYPE_WOOD,
    MINE_TYPE_COAL,
    MINE_TYPE_IRON_ORE,
    MINE_TYPE_URANIUM_ORE,
];