import Vector2 from "../../../libs/math/Vector2";
import GameGrid from "./GameGrid";
import Unit from "../unit/Unit";
import ValuePack from "../reaction/ValuePack";
import ReactiveObject from "../reaction/ReactiveObject";
import { DIRECTIONS } from "./Direction";
import { filterNotEmpty } from "../../../libs/lang/Collections";
import { Values } from "../value/Values";
import { rgbFromInt, styleColorRgb } from "../../../libs/math/Colors";

export default class Cell extends ReactiveObject {

    public unit: Unit | null = null;

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly grid: GameGrid,
    ) {
        super();
    }

    public get index() {
        return this.x + (this.y * this.grid.width);
    }

    private cachedPosition?: Vector2;
    public get position(): Vector2 {
        if (this.cachedPosition) return this.cachedPosition;
        this.cachedPosition = new Vector2(this.x, this.y);
        return this.cachedPosition;
    }

    public sendPack(pack: ValuePack) {
        this.grid.sendPack(this.position, pack);
    }

    public receivePack(pack: ValuePack) {
        this.unit?.receivePackAt(pack, this);
    }

    public getNearCell(direction: Vector2): Cell | null {
        return this.grid.getAt(this.x + direction.x, this.y + direction.y);
    }
    public get neighbors(): Array<Cell> {
        return filterNotEmpty(DIRECTIONS.map(dir => this.getNearCell(dir)));
    }

    public get mass() {
        return this.unit?.mass ?? 0;
    }

    public get color(): string {
        // 根据温度，计算颜色
        const temperature = Math.max(0, this.getCalculatedValue(Values.TEMPERATURE));
        const temp = temperature > 0 ? Math.max(temperature, 100) : 0;
        const t = Math.atan(temp / 200) / Math.PI;
        return styleColorRgb([t, 0, 1 - t]);
    }

}