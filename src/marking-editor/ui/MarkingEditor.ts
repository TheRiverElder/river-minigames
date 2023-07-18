import ListenerManager from "../../libs/management/ListenerManager";
import Vector2 from "../../libs/math/Vector2";

export interface MarkingEditor {
    readonly listenerUp: ListenerManager<Vector2>;
    readonly listenerMove: ListenerManager<Vector2>;
    readonly listenerDown: ListenerManager<Vector2>;
}