import Stand from "../lang/Stand";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";
import { Button, DragEventListeners, DragPointerEvent } from "./DragPointerEvent";

export default class DragContainer {
    readonly onDown = new ListenerManager<DragPointerEvent>();
    readonly onMove = new ListenerManager<DragPointerEvent>();
    readonly onUp = new ListenerManager<DragPointerEvent>();
    readonly onLeave = new ListenerManager<DragPointerEvent>();

    readonly listeners: DragEventListeners;
    enabled: boolean = true;
    positionDelegate: Stand<Vector2>;

    constructor(listeners: DragEventListeners, positionDelegate: Stand<Vector2>) {
        this.listeners = listeners;
        this.positionDelegate = positionDelegate;
    }

    initialize() {
        this.onDown.add(this.onContainerDown);
        this.onMove.add(this.onContainerMove);
        this.onUp.add(this.onContainerUp);
        this.onLeave.add(this.onContainerLeave);
    }

    destory() {
        this.onDown.remove(this.onContainerDown);
        this.onMove.remove(this.onContainerMove);
        this.onUp.remove(this.onContainerUp);
        this.onLeave.remove(this.onContainerLeave);
    }

    private started: boolean = false;
    private startHostPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private startPointerPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private moved: boolean = false;
    
    onContainerDown = (event: DragPointerEvent) => {
        if (!this.enabled) return;
        if (event.button !== Button.MIDDLE) return;
        this.startHostPosition = this.positionDelegate.get();
        this.startPointerPosition = event.globalPosition;
        this.moved = false;
        this.started = true;
    };

    onContainerMove = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (!this.moved) {
            this.listeners.onDragStart.emit(this.startHostPosition);
            this.moved = true;
        }

        const currentPointerPosition = event.globalPosition;
        const delta = currentPointerPosition.sub(this.startPointerPosition);
        const currentHostPosition = this.startHostPosition.add(delta);
        this.positionDelegate.set(currentHostPosition);
        this.listeners.onDragMove.emit(currentHostPosition);

    };

    onContainerUp = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (this.moved) {
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition);
            const currentHostPosition = this.startHostPosition.add(delta);
            this.positionDelegate.set(currentHostPosition);
            this.listeners.onDragMove.emit(currentHostPosition);
            this.listeners.onDragEnd.emit(currentHostPosition);
        } else {
            this.listeners.onClick.emit(this.startHostPosition);
        }

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerLeave = () => {
        this.positionDelegate.set(this.startHostPosition);
        this.listeners.onDragMove.emit(this.startHostPosition);
        this.listeners.onDragEnd.emit(this.startHostPosition);

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };
}