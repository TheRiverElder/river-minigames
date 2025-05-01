import Cell from "../grid/Cell";
import ReactiveObject from "../reaction/ReactiveObject";
import ValueType from "./ValueType";

// 这是计算值类型的接口，它继承了值类型，并添加了一个calculate方法，它一般依赖于其他值类型来计算自己的值。
export default abstract class CalculativeValueType implements ValueType {

    abstract get name(): string;

    getValueIn(obj: ReactiveObject): number {
        return this.calculate(obj);
    }
    
    abstract calculate(obj: ReactiveObject): number;

}