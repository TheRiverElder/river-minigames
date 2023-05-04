import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import { Side } from "../../gameobject/Behavior";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";

export enum Button {
    LEFT,
    MIDDLE,
    RIGHT,
    UNKNOWN,
}

export interface BehaviorPointerEvent {
    position: Vector2;
    button: Button;
    nativeEvent: PointerEvent;
}

export default class BehaviorPoinerListener extends BehaviorAdaptor {

    get side(): Side {
        return Side.CLIENT;
    }

    readonly onUiUpdate = new ListenerManager();
    readonly onPointerDown = new ListenerManager<BehaviorPointerEvent>();
    readonly onPointerMove = new ListenerManager<BehaviorPointerEvent>();
    readonly onPointerUp = new ListenerManager<BehaviorPointerEvent>();
}