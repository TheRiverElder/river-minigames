import { Nullable } from "../libs/lang/Optional";
import Behavior from "./Behavior";
import GameObject from "./GameObject";

export default class BehaviorManager {

    readonly gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
    }

    private behaviors: Array<Behavior> = [];

    addBehavior(...behaviors: Array<Behavior>) {
        this.behaviors.push(...behaviors);
    }

    // 用法：
    // const myBehavior: MyBehavior = behaviorManager.createAndAddBehavior(MyBehavior);

    createAndAddBehavior(type: any): Behavior {
        const behavior = new type(this.gameObject);
        this.behaviors.push(behavior);
        return behavior;
    }

    // 用法：
    // const myBehavior: MyBehavior = behaviorManager.getBehavior(MyBehavior);

    getBehavior(type: any): Nullable<Behavior> {
        const t = type;
        return this.behaviors.find(it => it.type === t) || null;
    }

    getBehaviors(type: any): Array<Behavior> {
        const t = type;
        return this.behaviors.filter(it => it.type === t) || null;
    }

    getAllBehaviors(): Array<Behavior> {
        return this.behaviors.slice();
    }

    clear() {
        this.behaviors.forEach(behavior => behavior.onDestroy());
        this.behaviors.splice(0, this.behaviors.length);
    }
}