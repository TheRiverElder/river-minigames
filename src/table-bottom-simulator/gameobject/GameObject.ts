import { int, double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import { deserializeVector2, serializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import User from "../user/User";
import Behavior from "./Behavior";
import BehaviorType from "./BehaviorType";

export default class GameObject implements Persistable {
    
    readonly simulator: TableBottomSimulator;

    readonly uid: int;

    readonly behaviors = new ObservableRegistry<int, Behavior>(behavior => behavior.uid);

    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
    }

    controller: Nullable<User> = null;

    private clientOnlyBehaviorUidGenerator = new IncrementNumberGenerator(-1, -1);

    createAndAddBehavior<T extends Behavior = Behavior>(type: BehaviorType<T>, uid: int, doInitialize: boolean = true): T {
        const behavior: T = type.create(this, uid);
        this.behaviors.add(behavior);
        if (doInitialize) behavior.onInitialize();
        return behavior;
    }

    createAndAddClientOnlyBehavior<T extends Behavior = Behavior>(type: BehaviorType<T>, doInitialize: boolean = true): T {
        const behavior: T = type.create(this, this.clientOnlyBehaviorUidGenerator.generate());
        this.behaviors.add(behavior);
        if (doInitialize) behavior.onInitialize();
        return behavior;
    }

    getBehaviorByType<T extends Behavior = Behavior>(type: BehaviorType<T>): Nullable<T> {
        return (this.behaviors.values().find(v => v.type === type) as T) || null;
    }

    // private destroyed: boolean = false;

    // 仅仅从客户端移除，要从客户端删除请使用EditChannel.removeGameOject(uid)
    remove() {
        // if (this.destroyed) return;
        // this.destroyed = true;
        this.simulator.gameObjects.remove(this);
        this.behaviors.values().forEach(b => b.onDestroy());
    }

    //#region 几何数据

    position: Vector2 = new Vector2(0, 0);
    size: Vector2 = new Vector2(0, 0);
    rotation: double = 0;
    background: string = "";
    shape: string = "circle";

    readonly onUiUpdateListeners = new ListenerManager();

    //#endregion 几何数据

    //#region 序列化与反序列化

    save(): any {
        return {
            ...this.saveSelf(),
            behaviors: this.behaviors.values().map(behavior => behavior.save()),
        };
    }

    restore(data: any): void {
        this.restoreSelf(data);

        for (const behaviorData of data.behaviors) {
            const uid: int = behaviorData.uid;
            this.behaviors.get(uid)
                .ifPresent(
                    behavior => behavior.restore(behaviorData),
                    () => {
                        const typeName: string = behaviorData.type;
                        this.simulator.behaviorTypes.get(typeName).ifPresent(type => {
                            // 如果不是客户端行为，则不实例化
                            if (!type.side.activeOnClient) return;
                            const beiavior = this.createAndAddBehavior(type, uid);
                            beiavior.restore(behaviorData);
                        });
                    },
                );
        }
    }

    saveSelf(): any {
        return {
            uid: this.uid,
            position: serializeVector2(this.position),
            size: serializeVector2(this.size),
            rotation: this.rotation,
            background: this.background,
            shape: this.shape,
        };
    }

    restoreSelf(data: any) {
        const controllerUid = data.controller;
        if (typeof controllerUid === "number") {
            if (controllerUid > 0) {
                this.simulator.users.get(data.controller).ifPresent(user => (this.controller = user));
            } else if (controllerUid < 0) {
                this.controller = null;
            }
        }

        this.position = deserializeVector2(data.position);
        this.size = deserializeVector2(data.size);
        this.rotation = data.rotation;
        this.background = data.background;
        this.shape = data.shape;
    }

    //#endregion 序列化与反序列化

}