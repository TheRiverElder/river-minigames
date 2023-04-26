import { int } from "../../libs/CommonTypes";
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

    get(direction: Direction): Cell | null {
        return this.program.board.get(this.x + direction.offset.x, this.y + direction.offset.y) || null;
    }

}