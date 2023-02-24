import { computeIfAbsent } from "../../libs/lang/Collections";
import Array2D from "../../libs/lang/Array2D";
import Vector2 from "../../libs/math/Vector2";
import Instruction from "./Instruction";
import Tile from "./Tile";
import Cell from "./Cell";

export default class Program {
    public readonly board: Array2D<Cell> = new Array2D(8, 8, (x, y) => new Cell(this, x, y));

    private cachedInstructions: Array<Instruction> | null = null;

    public get instructions(): Array<Instruction> {
        let instructions = this.cachedInstructions;
        if (instructions === null) {
            instructions = this.compile();
            this.cachedInstructions = instructions;
        }
        return instructions;
    }

    public compile() {

        const sourceMap = new Map<Tile, Set<Tile>>();

        const terminalTiles: Array<Tile> = [];
        this.board.forEach((cell, x, y) => {
            const tile = cell?.tile;
            if (!tile) return;
            if (tile.terminal) {
                terminalTiles.push(tile);
                return;
            }
            const targetPosition = new Vector2(x, y).add(tile.direction.offset);
            const target = this.board.getOrNull(...targetPosition.toArray())?.tile;
            if (!target) return;
            computeIfAbsent(sourceMap, target, () => new Set()).add(tile);
        });

        function resolve(tile: Tile, list: Array<Instruction>) {
            const sources = sourceMap.get(tile);
            if (!sources || sources.size === 0) return;
            sources.forEach(tile => resolve(tile, list));
            tile.compile(list);
        }

        const output: Array<Instruction> = [];
        terminalTiles.forEach(tile => resolve(tile, output));
        
        return output;
    }
}