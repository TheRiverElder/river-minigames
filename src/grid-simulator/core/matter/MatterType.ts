import PropertyValueType from "../value/PropertyValueType";

export default interface MatterType {

    get name(): string;

    getPropertyValue(key: PropertyValueType): number;

}