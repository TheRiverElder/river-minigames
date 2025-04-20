import { double } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import GameGrid from "./GameGrid";
import Unit from "./Unit";
import ValuePack from "./ValuePack";

export default class Cell {

    public unit: Unit | null = null;

    constructor (
        public readonly x: number,
        public readonly y: number,
        public readonly grid: GameGrid,
    ) { }

    public get index() {
        return this.x + (this.y * this.grid.width);
    }

    private cachedPosition?: Vector2;
    public get position(): Vector2 {
        if (this.cachedPosition) return this.cachedPosition;
        this.cachedPosition = new Vector2(this.x, this.y);
        return this.cachedPosition;
    }

    private values = new Map<string, double>();

    public sendPack(pack: ValuePack) {
        this.grid.sendPack(this.position, pack);
    }

    public receivePack(pack: ValuePack) {
        this.unit?.receivePack(pack, this);
    }

    public getCell(direction: Vector2) : Cell | null {
        return this.grid.getAt(this.x + direction.x, this.y + direction.y);
    }

}