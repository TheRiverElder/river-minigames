import Direction from "./Direction";
import Instruction from "./Instruction";
import type TileType from "./TileType";

const DIRECTIONS_IN_CLOCKWISE = [Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT];

export default abstract class Tile {

    public readonly type: TileType;
    public direction: Direction;

    constructor(type: TileType, direction: Direction = Direction.NONE) {
        this.type = type;
        this.direction = direction;
    }

    public rotate(antiClockwise: boolean = false) {
        if (this.direction === Direction.NONE) return;
        const directionCount = DIRECTIONS_IN_CLOCKWISE.length;
        const index = DIRECTIONS_IN_CLOCKWISE.indexOf(this.direction);
        if (index < 0 || index >= directionCount) return;
        const nextIndex = (index + (antiClockwise ? -1 : +1) + directionCount) % directionCount;
        this.direction = DIRECTIONS_IN_CLOCKWISE[nextIndex];
    }

    abstract get terminal(): boolean;
    abstract get activative(): boolean;

    abstract compile(output: Array<Instruction>): void;
    
    abstract copy(): Tile;

    abstract render(g: CanvasRenderingContext2D): void;
}