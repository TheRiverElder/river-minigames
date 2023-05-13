import Vector2 from "../../libs/math/Vector2";
import BehaviorType from "../gameobject/BehaviorType";
import GameObject from "../gameobject/GameObject";
import { serializeVector2 } from "../io/Utils";
import Channel from "./Channel";

export default class EditChannel extends Channel {

    static readonly CREATE_EMPTY_GAME_OBJECT = "create_empty_game_object";
    static readonly PASTE_GAME_OBJECT = "paste_game_object";
    static readonly CREATE_BEHAVIOR = "create_behavior";

    createEmptyGameObject(postion?: Vector2) {
        this.send({
            action: EditChannel.CREATE_EMPTY_GAME_OBJECT,
            postion: postion ? serializeVector2(postion) : null,
        });
    }

    pasteGameObject(gameObjectData: any, postion?: Vector2) {
        this.send({
            action: EditChannel.PASTE_GAME_OBJECT,
            data: gameObjectData,
            postion: postion ? serializeVector2(postion) : null,
        });
    }

    createBehavior(gameObject: GameObject, type: BehaviorType) {
        this.send({
            action: EditChannel.CREATE_BEHAVIOR,
            uid: gameObject.uid,
            type: type.name,
        });
    }

    override receive(data: any): void { }
}