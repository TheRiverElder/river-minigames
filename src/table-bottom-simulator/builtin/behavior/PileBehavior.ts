import BehaviorAdaptor from "../../simulator/gameobject/BehaviorAdaptor";
import BehaviorType from "../../simulator/gameobject/BehaviorType";
import Side from "../../simulator/gameobject/Side";

export default class PileBehavior extends BehaviorAdaptor {

    static readonly TYPE = new BehaviorType("pile", Side.BOTH, (...args) => new PileBehavior(...args))

}