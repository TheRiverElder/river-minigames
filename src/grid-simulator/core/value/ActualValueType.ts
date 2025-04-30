import Cell from "../grid/Cell";
import ValueType from "./ValueType";

// 这是真实存在的数值，不会根据计算而改变
export default interface ActualValueType extends ValueType {

    tick(cell: Cell): void;
}