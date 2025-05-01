import { Pair } from "../../../libs/CommonTypes";
import PropertyValueType from "../value/PropertyValueType";
import MatterType from "./MatterType";

export default class GenericMatterType implements MatterType {
    
    public readonly name: string;
    public readonly properties: Map<PropertyValueType, number>;

    constructor(name: string, properties?: Array<Pair<PropertyValueType, number>>) {
        this.name = name;
        this.properties = properties ? new Map(properties) : new Map();
    }

    getPropertyValue(key: PropertyValueType): number {
        return this.properties.get(key) ?? 0;
    }
    
}