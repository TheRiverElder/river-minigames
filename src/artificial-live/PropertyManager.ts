import { double } from "../libs/CommonTypes";

export type PropertyType = string;

export default class PropertyManager {
    private properties: Map<PropertyType, double> = new Map();

    public get(type: PropertyType): double {
        return this.properties.get(type) || 0;
    }

    public set(type: PropertyType, value: double) {
        this.properties.set(type, value);
    }

    public remove(type: PropertyType) {
        this.properties.delete(type);
    }
}