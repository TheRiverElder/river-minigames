import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Part from "../Part";
import Direction from "./Direction";
import Program from "./Program";
import Tile from "./Tile";

export default class Cell {
    public readonly program: Program;
    public readonly x: int;
    public readonly y: int;

    public tile: Tile | null = null;

    constructor(program: Program, x: int, y: int, tile: Tile | null = null) {
        this.program = program;
        this.x = x;
        this.y = y;
        this.tile = tile;
    }

    get(direction: Direction): Nullable<Cell> {
        return this.program.board.getOrNull(this.x + direction.offset.x, this.y + direction.offset.y);
    }

    getArgs(part: Part): Array<any> {
        return (part.memory.get(this.x, this.y) || []);
    }

    sendArgument(arg: any, part: Part) {
        if (!this.tile) return;
        const dir = this.tile.direction;
        if (dir === Direction.NONE) return;
        const targetCell = this.get(dir);
        if (!targetCell) return;
        targetCell.receiveArgument(dir, arg, part);
    }

    // 此处的direction是传播的方向，不是对于该槽位的方向
    receiveArgument(direction: Direction, arg: any, part: Part) {
        if (!this.tile) return;
        this.tile.receiveArgument(direction, arg, this, part);
    }


}