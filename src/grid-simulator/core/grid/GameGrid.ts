import { createArray } from "../../../libs/lang/Collections";
import Vector2 from "../../../libs/math/Vector2";
import Cell from "./Cell";
import { DIRECTIONS } from "./Direction";
import Grid from "./Grid";
import ValuePack from "../reaction/ValuePack";

export default class GameGrid extends Grid<Cell> {

    constructor(width: number, height: number) {
        super(width, height);
        this.data = createArray(width * height, (i) => new Cell(i % width, Math.floor(i / width), this));
    }


    public get directions() {
        return DIRECTIONS;
    }

    public get cells(): Cell[] {
        return this.data as Cell[];
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