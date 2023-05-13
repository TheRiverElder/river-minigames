import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import BehaviorType from "../../gameobject/BehaviorType";
import Side from "../../gameobject/Side";

export default class PileBehavior extends BehaviorAdaptor {

    static readonly TYPE = new BehaviorType("pile", Side.BOTH, (...args) => new PileBehavior(...args))

    override receiveInstruction(data: any): void { }

}