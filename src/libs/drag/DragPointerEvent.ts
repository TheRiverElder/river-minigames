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
    readonly onDragStart: ListenerManager<Vector2>;
    readonly onDragMove: ListenerManager<Vector2>;
    readonly onDragEnd: ListenerManager<Vector2>;
    readonly onClick: ListenerManager<Vector2>;
}

export function passOrCreate(listeners: Nullable<DragEventListeners>): DragEventListeners {
    return listeners || {
        onDragStart: new ListenerManager<Vector2>(),
        onDragMove: new ListenerManager<Vector2>(),
        onDragEnd: new ListenerManager<Vector2>(),
        onClick: new ListenerManager<Vector2>(),
    };
}