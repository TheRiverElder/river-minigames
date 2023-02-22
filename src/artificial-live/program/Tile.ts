import { int } from "../../libs/CommonTypes";
import Direction from "./Direction";
import Instruction from "./Instruction";
import Program from "./Program";
import type TileType from "./TileType";

export default abstract class Tile {

    
    public readonly program: Program;
    public readonly x: int;
    public readonly y: int;
    public readonly type: TileType;

    public direction: Direction;

    constructor(program: Program, x: int, y: int, type: TileType, direction: Direction) {
        this.program = program;
        this.x = x;
        this.y = y;
        this.type = type;
        this.direction = direction;
    }

    abstract get terminal(): boolean;

    abstract compile(output: Array<Instruction>): void;
}