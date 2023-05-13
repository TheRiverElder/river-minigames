import { Nullable } from "../lang/Optional";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";

export enum Button {
    LEFT,
    MIDDLE,
    RIGHT,
    UNKNOWN,
}

export interface DragPointerEvent {
    readonly localPosition: Vector2;
    readonly globalPosition: Vector2;
    readonly button: Button;
    readonly nativeEvent: PointerEvent;
}

export interface DragEventListeners {
    readonly onDragStartListeners: ListenerManager<Vector2>;
    readonly onDragMoveListeners: ListenerManager<Vector2>;
    readonly onDragEndListeners: ListenerManager<Vector2>;
    readonly onClickListeners: ListenerManager<Vector2>;
}

export function passOrCreate(listeners: Nullable<DragEventListeners>): DragEventListeners {
    return listeners || {
        onDragStartListeners: new ListenerManager<Vector2>(),
        onDragMoveListeners: new ListenerManager<Vector2>(),
        onDragEndListeners: new ListenerManager<Vector2>(),
        onClickListeners: new ListenerManager<Vector2>(),
    };
}