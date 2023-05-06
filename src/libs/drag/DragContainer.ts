import ListenerManager from "../management/ListenerManager";
import { DragPointerEvent } from "./DragPointerEvent";

export default class DragContainer {
    readonly onMove = new ListenerManager<DragPointerEvent>();
    readonly onUp = new ListenerManager<DragPointerEvent>();
}