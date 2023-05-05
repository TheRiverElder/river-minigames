import { int, double } from "../../libs/CommonTypes";
import Optional, { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import BehaviorPoinerListener from "../builtin/behavior/BehaviorPoinerListener";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";
import { serializeVector2, deserializeVector2 } from "../io/Utils";
import TableBottomSimulatorCommon from "../simulator/TableBottomSimulatorCommon";
import TableBottomSimulator from "../TableBottomSimulator";
import User from "../user/User";
import BehaviorManager from "./BehaviorManager";

export default class GameObject implements Persistable, Updatable {

    // 只是构建，但是不恢复内容，要恢复内容，请用GameObject.restore()
    static constructGameObject(simulator: TableBottomSimulator, data: any): GameObject {
        return new GameObject(simulator, data.uid);
    }
    
    readonly simulator: TableBottomSimulator;

    // // 设置UID的方法：
    // // 1. constructor设置
    // // 2. restore恢复
    // private uidValue: int;
    // get uid(): int {
    //     return this.uidValue;
    // }
    // private set uid(value: int) {
    //     const previousUid = this.uidValue;
    //     if (value === previousUid) return;
    //     this.simulator.gameObjectsByUid.removeByKey(previousUid);
    //     this.uidValue = value;
    //     if (value > 0) {
    //         this.simulator.gameObjectsByUid.add(this);
    //     }
    // }
    readonly uid: int;

    readonly behaviors = new BehaviorManager(this);

    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
    }

    

    private _controller: Nullable<User> = null;
    get controller(): Nullable<User> {
        return this._controller;
    }
    set controller(value: Nullable<User>) {
        if (value !== this._controller) {
            this.selfDirty = true;
        }
        this._controller = value;
    }

    //#region 几何数据

    private _position: Vector2 = new Vector2(0, 0);
    get position(): Vector2 { return this._position; };
    set position(value: Vector2) { 
        this._position = value;
        this.selfDirty = true;
    };

    private _size: Vector2 = new Vector2(0, 0);
    get size(): Vector2 { return this._size; };
    set size(value: Vector2) { 
        this._size = value;
        this.selfDirty = true;
    };

    private _rotation: double = 0;
    get rotation(): double { return this._rotation; };
    set rotation(value: double) { 
        this._rotation = value;
        this.selfDirty = true;
    };

    //#endregion 几何数据

    //#region 树状节点
    
    private parentObject: Nullable<GameObject> = null;
    private readonly childObjects: Array<GameObject> = [];

    get parent(): Nullable<GameObject> {
        return this.parentObject;
    }

    set parent(obj: Nullable<GameObject>) {
        this.parentObject?.removeChild(this);
        obj?.addChild(this);
        this.parentObject = obj;
    }

    get children(): Array<GameObject> {
        return this.childObjects.slice();
    }


    addChild(...children: Array<GameObject>) {
        for (const child of children) {
            if (this.childObjects.indexOf(child) >= 0) continue;
            this.childObjects.push(child);
            child.parentObject = this;
            this.simulator.updatables.add(child);
            this.simulator.gameObjects.add(child);
        }
    }

    getChildAt(index: int): Nullable<GameObject> {
        return this.childObjects[index] || null;
    }

    get childrenAmount(): int {
        return this.childObjects.length;
    }

    removeChild(...children: Array<GameObject>) {
        for (const child of children) {
            const index = this.childObjects.indexOf(child);
            if (index < 0) continue;
            this.childObjects.splice(index, 1);
            child.parentObject = null;
        }
    }

    clearChildren() {
        for (const child of this.childObjects) {
            child.parentObject = null;
        }
        this.childObjects.splice(0, this.childObjects.length);
    }

    //#endregion 树状节点

    //#region 序列化与反序列化
    
    save(): any {
        return {
            uid: this.uid,
            ...this.saveSelf(),
            parent: this.parentObject?.uid || -1,
            children: this.childObjects.map(child => child.save()),
            behaviors: this.behaviors.getAllBehaviors().map(behavior => [behavior.type.name, behavior.save()]),
        };
    }

    clear() {
        this.parentObject = null;
        this.clearChildren();
        this.behaviors.clear();
    }

    restore(data: any): void {
        this.clear();

        this.restoreSelf(data);

        for (const childData of data.children) {
            const child = GameObject.constructGameObject(this.simulator, childData);
            this.addChild(child);
            child.restore(childData);
        }
        
        for (const [behaviorName, behaviorData] of data.behavior) {
            const type = this.simulator.behaviorTypes.getOrThrow(behaviorName);
            const behavior = this.behaviors.createAndAddBehavior(type);
            behavior.restore(behaviorData);
        }
    }

    saveSelf(): any {
        return {
            controller: this.controller?.uid || -1,
            position: serializeVector2(this._position),
            size: serializeVector2(this._size),
            rotation: this._rotation,
        };
    }

    restoreSelf(data: any) {
        if (data.controller > 0) {
            this.simulator.users.get(data.controller)
                .ifPresent(user => (this._controller = user));
        } else if (data.controller < 0) {
            this._controller = null;
        }
        if (data.position) this._position = deserializeVector2(data.position);
        if (data.size) this._size = deserializeVector2(data.size);
        if (data.rotation) this._rotation = data.rotation;
        if (data.parent > 0) {
            this.simulator.gameObjects.get(data.parent)
                .ifPresent(parent => {
                    if (parent !== this.parentObject) {
                        this.parent = parent;
                    }
                });
        } else if (data.parent < 0) {
            this.parent = null;
        }
    }

    //#endregion 序列化与反序列化

    //#region 增量更新数据
    
    private selfDirty: boolean = true;

    get dirty(): boolean {
        return this.selfDirty || this.behaviors.getAllBehaviors().some(behavior => behavior.dirty);
    }

    set dirty(value: boolean) {
        this.selfDirty = value;
    }

    generateUpdatePack(): any {
        const data: any = {
            uid: this.uid,
        };
        if (this.selfDirty) {
            Object.assign(data, this.saveSelf());
        }
        const behaviorsData: Array<[string, any]> = [];
        for (const behavior of this.behaviors.getAllBehaviors()) {
            if (!behavior.dirty) continue;
            if (this.simulator.side.activeOnServer && !behavior.side.activeOnClient) continue;
            if (this.simulator.side.activeOnClient && !behavior.side.activeOnServer) continue;
            behaviorsData.push([behavior.type.name, behavior.generateUpdatePack()]);
            behavior.dirty = false;
        }
        if (behaviorsData.length > 0) {
            data.behavior = behaviorsData;
        }

        this.selfDirty = false;
    }

    receiveUpdatePack(data: any): void {
        this.restoreSelf(data);
        if (data.behaviors) {
            for (const [behaviorName, behaviorData] of data.behaviors) {
                const behavior = this.behaviors.getBehaviorByName(behaviorName);
                if (!behavior) continue;
                behavior.receiveUpdatePack(behaviorData);
            }
        }
        if (this.simulator.side.activeOnClient && this.controller !== (this.simulator as TableBottomSimulatorCommon).user) {
            Optional.ofNullable<BehaviorPoinerListener>(this.behaviors.getBehavior(BehaviorPoinerListener))
                .ifPresent(b => b.onUiUpdate.emit());
        }
    }

    //#endregion 增量更新数据

}