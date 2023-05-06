import { int, double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";
import { deserializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import User from "../user/User";
import Behavior from "./Behavior";

export default class GameObject implements Persistable, Updatable {

    // 只是构建，但是不恢复内容，要恢复内容，请用GameObject.restore()
    static constructGameObject(simulator: TableBottomSimulator, data: any): GameObject {
        return new GameObject(simulator, data.uid);
    }
    
    readonly simulator: TableBottomSimulator;

    readonly uid: int;

    readonly behaviors = new Registry<int, Behavior>(behavior => behavior.uid);

    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
    }

    controller: Nullable<User> = null;

    private clientOnlyBehaviorUidGenerator = new IncrementNumberGenerator(-1, -1);

    createAndAddBehavior<T extends Behavior = Behavior>(type: any, uid: int): T {
        const behavior = new type(this, uid);
        this.behaviors.add(behavior);
        return behavior;
    }

    createAndAddClientOnlyBehavior<T extends Behavior = Behavior>(type: any): T {
        const behavior = new type(this, this.clientOnlyBehaviorUidGenerator.generate());
        this.behaviors.add(behavior);
        return behavior;
    }

    getBehaviorByType<T extends Behavior = Behavior>(type: any): Nullable<T> {
        return (this.behaviors.values().find(v => v.type === type) as T) || null;
    }

    private destroyed: boolean = false;

    remove() {
        if (this.destroyed) return;
        this.destroyed = true;
        this.simulator.gameObjects.remove(this);
        this.behaviors.values().forEach(b => b.onDestroy());
    }

    //#region 几何数据

    position: Vector2 = new Vector2(0, 0);

    size: Vector2 = new Vector2(0, 0);

    rotation: double = 0;

    readonly onUiUpdate = new ListenerManager();

    //#endregion 几何数据

    //#region 反序列化

    restore(data: any): void {
        if (data.destroyed) {
            this.remove();
            return;
        }
        this.restoreSelf(data);

        for (const behaviorData of data.behaviors) {
            const uid: int = behaviorData.uid;
            const type: string = behaviorData.type;
            this.behaviors.get(uid)
                .ifPresent(
                    behavior => behavior.restore(behaviorData),
                    () => this.createAndAddBehavior(
                        this.simulator.behaviorTypes.get(type), uid
                    ).restore(behaviorData),
                );
        }
    }

    restoreSelf(data: any) {
        if (data.controller > 0) {
            this.simulator.users.get(data.controller)
                .ifPresent(user => (this.controller = user));
        } else if (data.controller < 0) {
            this.controller = null;
        }

        this.position = deserializeVector2(data.position);
        this.size = deserializeVector2(data.size);
        this.rotation = data.rotation;
    }

    //#endregion 序列化与反序列化

    //#region 增量更新数据

    receiveUpdatePack(data: any): void {
        if (data.destroyed) {
            this.remove();
            return;
        }
        this.restoreSelf(data);

        if (data.behaviors) {
            for (const behaviorData of data.behaviors) {
                const uid: int = behaviorData.uid;
                this.behaviors.get(uid)
                    .ifPresent(behavior => behavior.receiveUpdatePack(behaviorData));
            }
        }
    }

    //#endregion 增量更新数据

}