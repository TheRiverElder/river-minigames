import GameObject from "./GameObject";
import Persistable from "./Persistable";
import Updatable from "./Updatable";

export default abstract class Behavior implements Persistable, Updatable {

    readonly host: GameObject;

    dirty: boolean = true;

    // 请务必保留一个这样的构造器
    constructor(host: GameObject) {
        this.host = host;
    }

    // 获取类型
    get type(): any {
        return Object.getPrototypeOf(this).constructor;
    }
    
    abstract save(): any;
    abstract restore(data: any): void;
    abstract generateUpdatePack(): any;

    abstract onDestroy(): void;
}