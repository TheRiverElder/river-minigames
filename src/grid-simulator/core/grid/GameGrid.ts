import { createArray } from "../../../libs/lang/Collections";
import Vector2 from "../../../libs/math/Vector2";
import Cell from "./Cell";
import { DIRECTIONS } from "./Direction";
import Grid from "./Grid";
import ValuePack from "../reaction/ValuePack";
import Shell from "./Shell";
import { Matters } from "../matter/Matters";

export default class GameGrid extends Grid<Cell> {

    constructor(width: number, height: number) {
        super(width, height);
        this.data = createArray(width * height, (i) => this.createEmptyCell(i));
    }

    protected createEmptyCell(index: number): Cell {
        const shell = new Shell([
            [Matters.STEEL, 20],
            [Matters.WATER, 1000],
        ]);

        return new Cell(index, this, shell);
    }

    public get directions() {
        return DIRECTIONS;
    }

    public get cells(): Cell[] {
        return this.data as Cell[];
    }

    getCellByIndex(index: number): Cell | null {
        return this.get(this.getCoord(index));
    }

    public sendPack(sourcePosition: Vector2, pack: ValuePack) {
        const nextPosition = sourcePosition.add(pack.direction);
        if (!this.isInBounds(nextPosition)) return;

        const cell = this.get(nextPosition);

        if (cell !== null) {
            cell.receivePack(pack,);
        }
    }
}