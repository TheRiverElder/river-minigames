import ReactiveObject from "../reaction/ReactiveObject";

export default interface ValueType {

    get name(): string;

    getValueIn(obj: ReactiveObject): number;
    
}