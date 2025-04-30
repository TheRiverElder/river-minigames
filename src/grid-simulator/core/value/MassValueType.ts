import Cell from "../grid/Cell";
import ReactiveObject from "../reaction/ReactiveObject";
import CalculativeValueType from "./CalculativeValueType";

export default class MassValueType implements CalculativeValueType {
    
    get name(): string {
        return "mass";
    }

    calculate(obj: ReactiveObject): number {
        return obj.mass;
    }
}