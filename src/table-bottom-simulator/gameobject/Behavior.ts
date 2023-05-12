import GameObject from "./GameObject";
import Persistable from "../io/Persistable";
import { int } from "../../libs/CommonTypes";
import BehaviorType from "./BehaviorType";
import ConfigItem from "../ui/config/ConfigItem";

export default abstract class Behavior implements Persistable {

    readonly type: BehaviorType;
    readonly host: GameObject;
    readonly uid: int;

    constructor(type: BehaviorType, host: GameObject, uid: int) {
        this.type = type;
        this.host = host;
        this.uid = uid;
        // this.onInitialize();
    }

    remove() {
        this.host.behaviors.remove(this);
        this.onDestroy()
    }
    
    abstract restore(data: any): void;
    abstract receiveUpdatePack(data: any): void;

    abstract onInitialize(): void;
    abstract onDestroy(): void;

    abstract get configItems(): Array<ConfigItem>;
}