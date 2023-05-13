import { double, Supplier } from "../CommonTypes";
import { Nullable } from "../lang/Optional";
import Stand from "../lang/Stand";
import ListenerManager from "../management/ListenerManager";
import Vector2 from "../math/Vector2";
import DragContainer from "./DragContainer";
import { Button, DragEventListeners, DragPointerEvent } from "./DragPointerEvent";


export default class DragElement {
    readonly onDown = new ListenerManager<DragPointerEvent>();
    readonly onUp = new ListenerManager<DragPointerEvent>();

    readonly listeners: DragEventListeners;
    container: Nullable<DragContainer> = null;
    enabled: boolean = true;
    positionDelegate: Stand<Vector2>;
    getScalar: Supplier<double>;

    constructor(listeners: DragEventListeners, positionDelegate: Stand<Vector2>, getScalar: Supplier<double> = (() => 1)) {
        this.listeners = listeners;
        this.positionDelegate = positionDelegate;
        this.getScalar = getScalar;
    }


    bindContainer(container: DragContainer) {
        this.container = container;
        this.onBindContainer(container);
    }

    unbindContainer() {
        if (!this.container) return;
        this.onUnbindContainer(this.container)
        this.container = null;
    }

    onBindContainer(container: DragContainer) {
        this.onDown.add(this.onElementDown);
        this.onUp.add(this.onElementUp);

        container.onMove.add(this.onContainerMove);
        container.onUp.add(this.onContainerUp);
        container.onLeave.add(this.onContainerUp);
    }

    onUnbindContainer(container: DragContainer) {
        this.onDown.remove(this.onElementDown);
        this.onUp.remove(this.onElementUp);

        container.onMove.remove(this.onContainerMove);
        container.onUp.remove(this.onContainerUp);
        container.onLeave.remove(this.onContainerUp);
    }

    private pressed: boolean = false;
    private started: boolean = false;
    private startHostPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private startPointerPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private moved: boolean = false;
    
    onElementDown = (event: DragPointerEvent) => {
        if (event.button !== Button.LEFT) return;
        this.pressed = true;
        if (!this.enabled) return;
        // console.log("onElementDown");
        this.startHostPosition = this.positionDelegate.get();
        this.startPointerPosition = event.globalPosition;
        this.moved = false;
        this.started = true;
    };

    onContainerMove = (event: DragPointerEvent) => {
        if (!this.started) return;
        if (!this.enabled) {
            this.onElementUp(event);
            return;
        }
        // console.log("onContainerMove");
        if (!this.moved) {
            this.listeners.onDragStartListeners.emit(this.startHostPosition);
            // console.log("onDragStart", this.listeners.onDragStart);
            this.moved = true;
        }

        const currentPointerPosition = event.globalPosition;
        const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
        // console.log("delta", delta.toHunmanReadableString());
        const currentHostPosition = this.startHostPosition.add(delta);
        this.positionDelegate.set(currentHostPosition);
        this.listeners.onDragMoveListeners.emit(currentHostPosition);
        // console.log("onDragMove", this.listeners.onDragMove);

    };

    onElementUp = (event: DragPointerEvent) => {
        // if (!this.started) return;
        // console.log("onElementUp");
        if (this.moved) {
            if (!this.started) return;
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
            const currentHostPosition = this.startHostPosition.add(delta);
            this.positionDelegate.set(currentHostPosition);
            this.listeners.onDragMoveListeners.emit(currentHostPosition);
            // console.log("onDragMove", this.listeners.onDragMove);
            this.listeners.onDragEndListeners.emit(currentHostPosition);
            // console.log("onDragEnd", this.listeners.onDragEnd);
        } else {
            if (this.pressed) {
                this.listeners.onClickListeners.emit(this.startHostPosition);
            }
            // console.log("onClick", this.listeners.onClick);
        }

        event.nativeEvent.stopPropagation();

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerUp = (event: DragPointerEvent) => {
        // console.log("onElementUp");
        if (this.moved) {
            if (!this.started) return;
            const currentPointerPosition = event.globalPosition;
            const delta = currentPointerPosition.sub(this.startPointerPosition).div(this.getScalar());
            const currentHostPosition = this.startHostPosition.add(delta);
            this.positionDelegate.set(currentHostPosition);
            this.listeners.onDragMoveListeners.emit(currentHostPosition);
            this.listeners.onDragEndListeners.emit(currentHostPosition);
        } else {
            if (this.pressed) {
                this.listeners.onClickListeners.emit(this.startHostPosition);
            }
        }

        this.pressed = false;
        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

    onContainerLeave = () => {
        this.positionDelegate.set(this.startHostPosition);
        this.listeners.onDragMoveListeners.emit(this.startHostPosition);
        this.listeners.onDragEndListeners.emit(this.startHostPosition);

        this.pressed = false;
        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };

}