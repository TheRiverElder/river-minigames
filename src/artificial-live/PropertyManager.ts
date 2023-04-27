import { double, Productor } from "../libs/CommonTypes";
import { mutate } from "../libs/lang/Collections";
import BasicType from "../libs/management/BasicType";

export class PropertyType extends BasicType {

}

export default class PropertyManager {
    private properties: Map<PropertyType, double> = new Map();

    public get(type: PropertyType): double {
        return this.properties.get(type) || 0;
    }

    public set(type: PropertyType, value: double) {
        this.properties.set(type, value);
    }

    public mutate(type: PropertyType, delta: double | Productor<double, double>): double {
        const deltaValue: double = typeof delta === "function" ? delta(this.get(type)) : delta;
        return mutate(this.properties, type, () => 0, s => s + deltaValue);
    }

    public remove(type: PropertyType) {
        this.properties.delete(type);
    }
}