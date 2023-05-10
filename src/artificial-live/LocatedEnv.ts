import { double } from "../libs/CommonTypes";
import Vector2 from "../libs/math/Vector2";
import BionEnvironment from "./BionEnvironment";
import { PropertyType } from "./PropertyManager";

export default class LocatedEnv {
    readonly position: Vector2;
    readonly env: BionEnvironment;

    constructor(position: Vector2, env: BionEnvironment) {
        this.position = position;
        this.env = env;
    }
    
    drain(type: PropertyType, strength: double): double {
        return this.env.drain(this.position, type, strength);
    }
    
    sense(type: PropertyType): double {
        return this.env.sense(this.position, type);
    }

}