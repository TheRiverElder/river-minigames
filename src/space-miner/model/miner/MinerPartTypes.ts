import MinerPartType from "./MinerPartType";

export const MINER_PART_TYPE_EMPTY = new MinerPartType("empty");

export const MINER_PART_TYPE_FRAME = new MinerPartType("frame");
export const MINER_PART_TYPE_MAIN_CONTROL = new MinerPartType("main_control");
export const MINER_PART_TYPE_CARGO = new MinerPartType("cargo");
export const MINER_PART_TYPE_COLLECTOR = new MinerPartType("collector");

export const MINER_PART_TYPE_ADDITION = new MinerPartType("addition");

export const MINER_PART_TYPES = [
    MINER_PART_TYPE_FRAME,
    MINER_PART_TYPE_MAIN_CONTROL,
    MINER_PART_TYPE_CARGO,
    MINER_PART_TYPE_COLLECTOR,
    MINER_PART_TYPE_ADDITION,
];