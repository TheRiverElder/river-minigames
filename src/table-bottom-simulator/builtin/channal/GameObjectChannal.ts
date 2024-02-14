import Channel from "../../simulator/Channel";
import TableBottomSimulatorClient from "../../simulator/TableBottomSimulatorClient";
import Behavior from "../../simulator/gameobject/Behavior";
import GameObject from "../../simulator/gameobject/GameObject";

export default class GameObjectChannal extends Channel {
    

    static readonly UPDATE_GAME_OBJECT_FULL = "update_game_object_full";
    static readonly UPDATE_GAME_OBJECT_SELF = "update_game_object_self";
    static readonly REMOVE_GAME_OBJECT = "remove_game_object";
    static readonly UPDATE_BEHAVIOR = "update_behavior";
    static readonly REMOVE_BEHAVIOR = "remove_behavior";

    constructor(simulator: TableBottomSimulatorClient) {
        super("game_object", simulator);
    }

    // 发送GameObject的几何数据以及Behavior数据，接收者若无对应UID的GameObject则创建
    sendUpdateGameObjectFull(obj: GameObject) {
        this.send({
            action: GameObjectChannal.UPDATE_GAME_OBJECT_FULL,
            gameObject: obj.save(),
        });
    }

    // 只发送GameObject的几何数据，不包括Behavior数据，接收者若无对应UID的GameObject也不创建
    sendUpdateGameObjectSelf(obj: GameObject) {
        this.send({
            action: GameObjectChannal.UPDATE_GAME_OBJECT_SELF,
            gameObject: obj.saveSelf(),
        });
    }

    // 移除GameObject
    sendRemoveGameObject(obj: GameObject) {
        this.send({
            action: GameObjectChannal.REMOVE_GAME_OBJECT,
            uid: obj.uid,
        });
    }

    // 发送Behavior数据，接收者若无对应UID的Behavior则创建
    sendUpdateBehavior(behavior: Behavior) {
        this.send({
            action: GameObjectChannal.UPDATE_BEHAVIOR,
            hostUid: behavior.host.uid,
            behavior: behavior.save(),
        });
    }

    // 移除Behavior
    sendRemoveBehavior(behavior: Behavior) {
        this.send({
            action: GameObjectChannal.REMOVE_BEHAVIOR,
            hostUid: behavior.host.uid,
            behaviorUid: behavior.uid,
        });
    }


    override receive(data: any) {
        const action: string = data.action;
        switch(action) {
            case GameObjectChannal.UPDATE_GAME_OBJECT_FULL: this.receiveUpdateGameObjectFull(data); break;
            case GameObjectChannal.UPDATE_GAME_OBJECT_SELF: this.receiveUpdateGameObjectSelf(data); break;
            case GameObjectChannal.REMOVE_GAME_OBJECT: this.receiveRemoveGameObject(data); break;
            case GameObjectChannal.UPDATE_BEHAVIOR: this.receiveUpdateBehavior(data); break;
            case GameObjectChannal.REMOVE_BEHAVIOR: this.receiveRemoveBehavior(data); break;
            default: throw new Error(`Unknown action: ${action}`);
        }
    }

    private receiveUpdateGameObjectFull(data: any) {
        const gameObjectData = data.gameObject;
        const uid = gameObjectData.uid;
        this.simulator.gameObjects.get(uid)
            .ifPresent(gameObject => {
                gameObject.restore(gameObjectData);
                gameObject.onUiUpdateListeners.emit();
            }).ifEmpty(() => {
                const gameObject = new GameObject(this.simulator, uid);
                this.simulator.gameObjects.add(gameObject);
                gameObject.restore(gameObjectData);
                this.simulator.onWholeUiUpdateListeners.emit();
            });
    }

    private receiveUpdateGameObjectSelf(data: any) {
        const gameObjectData = data.gameObject;
        const uid = gameObjectData.uid;
        this.simulator.gameObjects.get(uid)
            .ifPresent(gameObject => {
                gameObject.restoreSelf(gameObjectData);
                gameObject.onUiUpdateListeners.emit();
            }).ifEmpty(() => {
                const gameObject = new GameObject(this.simulator, uid);
                this.simulator.gameObjects.add(gameObject);
                gameObject.restoreSelf(gameObjectData);
                this.simulator.onWholeUiUpdateListeners.emit();
            });
    }

    private receiveRemoveGameObject(data: any) {
        const gameObjectUid = data.uid;
        this.simulator.gameObjects.get(gameObjectUid).ifPresent(gameObject => {
            gameObject.remove();
            this.simulator.onWholeUiUpdateListeners.emit();
        });
    }

    private receiveUpdateBehavior(data: any) {
        const behaviorData = data.behavior;
        this.simulator.gameObjects.get(data.hostUid).ifPresent(host => {
            const behaviorUid = behaviorData.uid;
            host.behaviors.get(behaviorUid)
                .ifPresent(behavior => behavior.restore(behaviorData))
                .ifEmpty(() => 
                    this.simulator.behaviorTypes.get(behaviorData.type).ifPresent(type => {
                        host.createAndAddBehavior(type, behaviorUid);
                    })
                );
            host.onUiUpdateListeners.emit();
        });
    }

    private receiveRemoveBehavior(data: any) {
        this.simulator.gameObjects.get(data.hostUid).ifPresent(host => 
            host.behaviors.get(data.behaviorUid).ifPresent(behavior => {
                behavior.remove();
                host.onUiUpdateListeners.emit();
            })
        );
    }

}