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