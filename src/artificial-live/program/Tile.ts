import Direction from "./Direction";
import Instruction from "./Instruction";
import type TileType from "./TileType";

export default abstract class Tile {

    public readonly type: TileType;
    public direction: Direction;

    constructor(type: TileType, direction: Direction = Direction.NONE) {
        this.type = type;
        this.direction = direction;
    }

    abstract get terminal(): boolean;

    abstract compile(output: Array<Instruction>): void;

    abstract render(g: CanvasRenderingContext2D): void;
}