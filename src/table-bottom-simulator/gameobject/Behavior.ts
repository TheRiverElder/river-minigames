import GameObject from "./GameObject";
import Persistable from "../io/Persistable";
import { int } from "../../libs/CommonTypes";

export default abstract class Behavior implements Persistable {

    readonly host: GameObject;
    readonly uid: int;

    // 请务必保留一个这样的构造器
    constructor(host: GameObject, uid: int) {
        this.host = host;
        this.uid = uid;

        this.onInitialize();
    }

    // 获取类型
    get type(): any {
        return Object.getPrototypeOf(this).constructor;
    }
    
    abstract restore(data: any): void;
    abstract receiveUpdatePack(data: any): void;

    abstract onInitialize(): void;
    abstract onDestroy(): void;
}