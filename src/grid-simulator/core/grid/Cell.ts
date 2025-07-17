import Vector2 from "../../../libs/math/Vector2";
import GameGrid from "./GameGrid";
import Unit from "../unit/Unit";
import ValuePack from "../reaction/ValuePack";
import ReactiveObject from "../reaction/ReactiveObject";
import { DIRECTIONS } from "./Direction";
import { filterNotEmpty } from "../../../libs/lang/Collections";
import { Values } from "../value/Values";
import { styleColorRgb } from "../../../libs/math/Colors";
import Shell from "./Shell";
import ActualValueType from "../value/ActualValueType";
import PropertyValueType from "../value/PropertyValueType";

export default class Cell extends ReactiveObject {


    constructor(
        public readonly index: number,
        public readonly grid: GameGrid,
        public readonly shell: Shell,
        public unit: Unit | null = null,
    ) {
        super();
    }

    private cachedPosition?: Vector2;
    public get position(): Vector2 {
        if (this.cachedPosition) return this.cachedPosition;
        this.cachedPosition = this.grid.getCoord(this.index);
        return this.cachedPosition;
    }

    public getNearCell(direction: Vector2): Cell | null {
        const pos = this.position.add(direction);
        return this.grid.get(pos);
    }

    public get neighbors(): Array<Cell> {
        return filterNotEmpty(DIRECTIONS.map(dir => this.getNearCell(dir)));
    }

    public get mass() {
        return this.shell.mass + (this.unit?.mass ?? 0);
    }

    public get color(): string {
        // 根据温度，计算颜色
        const temperature = Math.max(0, this.getCalculatedValue(Values.TEMPERATURE));
        const temp = temperature > 0 ? Math.max(temperature, 100) : 0;
        const t = Math.atan(temp / 200) / Math.PI;
        return styleColorRgb([t, 0, 1 - t]);
    }

    override getValueTypes(): ActualValueType[] {
        return [...new Set([...this.shell.getValueTypes(), ...(this.unit?.getValueTypes() ?? [])])];
    }

    override getActualValue(key: ActualValueType): number {
        return this.shell.getActualValue(key) + (this.unit?.getActualValue(key) ?? 0);
    }

    override setActualValue(key: ActualValueType, value: number): void {
        this.shell.setActualValue(key, value);
    }

    override changeActualValue(key: ActualValueType, delta: number): void {
        this.shell.changeActualValue(key, delta);
    }

    override getPropertyValue(key: PropertyValueType): number {
        const mass = this.mass;
        if (!mass) return 0;
        let s = this.shell.getPropertyValue(key) * this.shell.mass;
        if (this.unit) {
            s += this.unit.getPropertyValue(key) * this.unit.mass;
        }
        return s / mass;
    }

    // 所有包都要先缓存到下一个tick再发送
    protected readyPacks: Array<ValuePack> = [];
    public recentPacks: Array<ValuePack> = [];

    public sendPack(pack: ValuePack) {
        const index = this.readyPacks.findIndex(existPack => existPack.valueType === pack.valueType && existPack.direction === pack.direction);
        if (index >= 0) {
            const oldPack = this.readyPacks[index];
            oldPack.changeValue(pack.value);
        } else {
            this.readyPacks.push(pack);
        }
    }

    public receivePack(pack: ValuePack) {
        const unit = this.unit;
        if (unit) {
            const restPack = unit.receivePackAt(pack, this);
            if (restPack) {
                super.receivePack(restPack);
            }
        } else {
            super.receivePack(pack);
        }
    }

    public resumePacks() {
        for (const pack of this.readyPacks) {
            this.grid.sendPack(this.position, pack);
        }
        this.recentPacks = this.readyPacks;
        this.readyPacks = [];
    }

}