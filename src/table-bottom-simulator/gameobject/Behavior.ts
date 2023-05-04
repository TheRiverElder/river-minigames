import GameObject from "./GameObject";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";

export class Side {
    static readonly SERVER = new Side(true, false);
    static readonly CLIENT = new Side(false, true);
    static readonly COMMON = new Side(true, true);
    static readonly NONE = new Side(false, false);

    readonly activeOnServer: boolean;
    readonly activeOnClient: boolean;

    private constructor(activeOnServer: boolean, activeOnClient: boolean) {
        this.activeOnServer = activeOnServer;
        this.activeOnClient = activeOnClient;
    }

    canAccept(side: Side): boolean {
        return (this.activeOnServer && side.activeOnServer) || (this.activeOnClient && side.activeOnClient);
    }
}

export default abstract class Behavior implements Persistable, Updatable {

    // 在哪端运行
    abstract get side(): Side;

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
    abstract receiveUpdatePack(data: any): void;

    abstract onInitialize(): void;
    abstract onDestroy(): void;
}