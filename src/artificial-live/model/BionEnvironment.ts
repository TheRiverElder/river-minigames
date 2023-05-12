import { double } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import { PROPERTY_TYPE_WATER, PROPERTY_TYPE_NUTRITION } from "../instances/neublumen/NeublumenPropertyTypes";
import { PropertyType } from "../PropertyManager";
import PartSlot from "./PartSlot";


export default class BionEnvironment {
    
    drain(position: Vector2, type: PropertyType, strength: double): double {
        switch (type) {
            case PROPERTY_TYPE_WATER: return (position.y < 4 ? 0.8 : 0.3) * strength;
            case PROPERTY_TYPE_NUTRITION: return (position.y < 4 ? 0.8 : 0.1) * strength;
            default: return 0;
        }
    }
    
    sense(position: Vector2, type: PropertyType): double {
        switch (type) {
            case PROPERTY_TYPE_WATER: return (position.y < 4 ? 5 : 1);
            case PROPERTY_TYPE_NUTRITION: return (position.y < 4 ? 5 : 1);
            default: return 0;
        }
    }

    effect(slot: PartSlot) {
        
    }
}