import { double, int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import BehaviorManager from "./BehaviorManager";
import Persistable from "./Persistable";
import TableBottomSimulator from "./TableBottomSimulator";
import Updatable from "./Updatable";

export default class GameObject implements Persistable, Updatable {
    
    readonly simulator: TableBottomSimulator;

    private uidValue: int;
    get uid(): int {
        return this.uidValue;
    }

    readonly behaviors = new BehaviorManager(this);

    constructor(simulator: TableBottomSimulator, uid: int = -1) {
        this.simulator = simulator;
        this.uidValue = uid;
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
            position: serializeVector2(this.position),
            size: serializeVector2(this.size),
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

        this.uidValue = data.uid;
        this.position = deserializeVector2(data.position);
        this.size = deserializeVector2(data.size);
        for (const childData of data.children) {
            const child = new GameObject(this.simulator);
            this.addChild(child);
            child.restore(childData);
        }
        for (const [behaviorName, behaviorData] of data.behavior) {
            const type = this.simulator.behaviorTypes.getOrThrow(behaviorName);
            const behavior = this.behaviors.createAndAddBehavior(type);
            behavior.restore(behaviorData);
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
        throw new Error("Method not implemented.");
    }

    //#endregion 增量更新数据

}

function serializeVector2(vector: Vector2): any {
    return { x: vector.x, y: vector.y };
}

function deserializeVector2(data: any): Vector2 {
    return new Vector2(data.x, data.y);
}