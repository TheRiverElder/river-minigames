import Vector2 from "../../libs/math/Vector2";
import GameObject from "../gameobject/GameObject";
import { serializeVector2 } from "../io/Utils";
import Channel from "./Channel";

export default class EditChannel extends Channel {

    createEmptyGameObject(postion?: Vector2) {
        this.send({
            action: "createEmptyGameObject",
            postion: postion ? serializeVector2(postion) : null,
        });
    }

    pasteGameObject(gameObjectData: any, postion?: Vector2) {
        this.send({
            action: "pasteGameObject",
            data: gameObjectData,
            postion: postion ? serializeVector2(postion) : null,
        });
    }

    removeGameObject(gameObject: GameObject) {
        this.send({
            action: "removeGameObject",
            uid: gameObject.uid,
        });
    }

    receive(data: any): void { }
}