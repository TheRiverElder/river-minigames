import Vector2 from "../../../libs/math/Vector2";
import { serializeVector2 } from "../../io/Utils";
import Channel from "../../simulator/Channel";
import TableBottomSimulatorClient from "../../simulator/TableBottomSimulatorClient";
import BehaviorType from "../../simulator/gameobject/BehaviorType";
import GameObject from "../../simulator/gameobject/GameObject";

export default class EditChannel extends Channel {

    static readonly CREATE_EMPTY_GAME_OBJECT = "create_empty_game_object";
    static readonly PASTE_GAME_OBJECT = "paste_game_object";
    static readonly CREATE_BEHAVIOR = "create_behavior";

    constructor(simulator: TableBottomSimulatorClient) {
        super("edit", simulator);
    }

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