import GameObject from "./GameObject";
import BehaviorType from "./BehaviorType";
import { Consumer, int } from "../../../libs/CommonTypes";
import Persistable from "../../io/Persistable";
import ConfigItem from "../../ui/config/ConfigItem";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import { CSSProperties } from "react";

export default abstract class Behavior implements Persistable {

    readonly type: BehaviorType;
    readonly host: GameObject;
    readonly uid: int;

    get simulator(): TableBottomSimulatorClient {
        return this.host.simulator;
    }

    constructor(type: BehaviorType, host: GameObject, uid: int) {
        this.type = type;
        this.host = host;
        this.uid = uid;
        // this.onInitialize();
    }

    // Client-only
    public abstract handleRenderCssProperties(properties: CSSProperties): void;

    remove() {
        this.host.behaviors.remove(this);
        this.onDestroy()
    }

    sendUpdate() {
        this.simulator.channelGameObject.sendUpdateBehavior(this);
    }

    // 对服务端发送指令
    sendInstruction(data: any) {
        this.simulator.channelBehaviorInstruction.sendInstruction(this, data);
    }

    // 从服务端接收指令
    abstract receiveInstruction(data: any): void
    
    save(): any {
        return {
            uid: this.uid,
            type: this.type.name,
        };
    }
    
    abstract restore(data: any): void;

    abstract onInitialize(): void;
    abstract onDestroy(): void;

    // Client Only
    abstract get configItems(): Array<ConfigItem>;

    createSetterAndSendUpdater<T>(setter: Consumer<T>) {
        return (value: T) => {
            setter(value);
            this.sendUpdate();
        };
    }

    abstract getTags(): Array<string>;
}