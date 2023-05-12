import Array2D from "../../libs/lang/Array2D";
import { filterNotNull } from "../../libs/lang/Collections";
import { requireNonNull } from "../../libs/lang/Objects";
import Part from "../model/Part";
import Cell from "./Cell";

export default class Program {
    public readonly board: Array2D<Cell>;

    constructor(board?: Array2D<Cell>) {
        this.board = board || new Array2D(8, 8, (x, y) => new Cell(this, x, y));
    }

    // private cachedInstructions: Array<Instruction> | null = null;

    // public get instructions(): Array<Instruction> {
    //     let instructions = this.cachedInstructions;
    //     if (instructions === null) {
    //         instructions = this.compile();
    //         this.cachedInstructions = instructions;
    //     }
    //     return instructions;
    // }

    // public refresh() {
    //     this.cachedInstructions = this.compile();
    // }

    // public compile() {

    //     const sourceMap = new Map<Tile, Set<Tile>>();
    //     const tileOutputIndexes = new Map<Tile, int>();
    //     let tileOutputIndexCounter = 0;

    //     const terminalTiles: Array<Tile> = [];
    //     this.board.forEach((cell, x, y) => {
    //         const tile = cell?.tile;
    //         if (!tile) return;
    //         if (tile.terminal) {
    //             terminalTiles.push(tile);
    //             return;
    //         }
    //         const targetPosition = new Vector2(x, y).add(tile.direction.offset);
    //         const target = this.board.getOrNull(...targetPosition.toArray())?.tile;
    //         if (!target) return;
    //         computeIfAbsent(sourceMap, target, () => new Set()).add(tile);
    //         tileOutputIndexes.set(tile, tileOutputIndexCounter++);
    //     });

    //     const output: Array<Instruction> = [];
    //     const visited: Set<Tile> = new Set();
    //     function resolve(tile: Tile) {
    //         if (visited.has(tile)) return;
    //         visited.add(tile);
    //         sourceMap.get(tile)?.forEach(tile => resolve(tile));
    //         tile.compile(output);
    //     }

    //     terminalTiles.forEach(tile => resolve(tile));
        
    //     return output;
    // }

    private queue: Array<Cell> = [];

    prepare() {
        this.queue = filterNotNull(this.board.getAll().filter(cell => !!cell?.tile?.activative));
    }

    run(part: Part) {

        while (this.queue.length > 0) {
            const cell: Cell = requireNonNull(this.queue.shift());
            const tile = cell.tile;
            if (!tile) continue;

            tile.execute(cell, part);
        }
    }

    schedule(...cells: Array<Cell>) {
        this.queue.push(...cells);
    }

    copy() {
        const program = new Program();
        program.board.forEach((cell, x, y) => cell.tile = this.board.get(x, y).tile?.copy() || null);
        return program;
    }
}