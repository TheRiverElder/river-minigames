import ReactiveObject from "../reaction/ReactiveObject";
import ValueType from "./ValueType";

export default class PropertyValueType implements ValueType {

    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    getValueIn(obj: ReactiveObject): number {
        return obj.getPropertyValue(this);
    }

    public toString() {
        return this.name;
    }
    
}