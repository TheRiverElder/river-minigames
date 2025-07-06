import Cell from "../grid/Cell";
import ReactiveObject from "../reaction/ReactiveObject";
import ValueType from "./ValueType";

// 这是真实存在的数值，不会根据计算而改变
export default abstract class ActualValueType implements ValueType {

    abstract get name(): string;

    getValueIn(obj: ReactiveObject): number {
        return obj.getActualValue(this);
    }

    abstract tick(cell: Cell): void;

    public toString() {
        return this.name;
    }
}