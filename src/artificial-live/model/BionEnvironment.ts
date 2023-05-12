import { double } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import { PROPERTY_TYPE_WATER, PROPERTY_TYPE_NUTRITION } from "../instances/neublumen/NeublumenPropertyTypes";
import PropertyManager, { PropertyType } from "../PropertyManager";
import PartSlot from "./PartSlot";


export default class BionEnvironment {

    private properties = new PropertyManager();
    
    tick() {
        this.properties.set(PROPERTY_TYPE_WATER, 6);
        this.properties.set(PROPERTY_TYPE_NUTRITION, 4);
    }

    private getAntiStrength(position: Vector2, type: PropertyType) {
        return position.y < 4 ? 1 : 2;
    }

    drain(position: Vector2, type: PropertyType, strength: double): double {
        const antiStrength = this.getAntiStrength(position, type);
        const s = strength - antiStrength;
        if (s <= 0) return 0.0;

        const drained = Math.max(this.properties.get(type), 0);
        return drained;
    }
    
    sense(position: Vector2, type: PropertyType): double {
        const antiStrength = this.getAntiStrength(position, type);
        return Math.max(this.properties.get(type) - antiStrength, 0);
    }

    effect(slot: PartSlot) {
        
    }
}