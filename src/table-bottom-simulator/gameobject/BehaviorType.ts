import { int } from "../../libs/CommonTypes";
import Behavior from "./Behavior";
import GameObject from "./GameObject";
import Side from "./Side";

type Creator<T extends Behavior> = (type: BehaviorType, host: GameObject, uid: int) => T;

export default class BehaviorType<T extends Behavior = Behavior> {
    readonly name: string;
    readonly side: Side;
    protected readonly creator: Creator<T>;

    constructor(name: string, side: Side, creator: Creator<T>) {
        this.name = name;
        this.side = side;
        this.creator = creator;
    }

    create(host: GameObject, uid: int): T {
        return this.creator(this, host, uid);
    }
}