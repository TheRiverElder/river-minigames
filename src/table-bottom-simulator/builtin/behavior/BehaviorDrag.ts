import { Nullable } from "../../../libs/lang/Optional";
import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import { Side } from "../../gameobject/Behavior";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import GameObject from "../../gameobject/GameObject";
import BehaviorPoinerListener, { BehaviorPointerEvent } from "./BehaviorPoinerListener";

export default class BehaviorDrag extends BehaviorAdaptor {

    readonly onDragStart = new ListenerManager<Vector2>();
    readonly onDragMove = new ListenerManager<Vector2>();
    readonly onDragEnd = new ListenerManager<Vector2>();
    readonly onClick = new ListenerManager<Vector2>();

    get side(): Side {
        return Side.CLIENT;
    }

    constructor(host: GameObject) {
        super(host);

        const pointerListeners: Nullable<BehaviorPoinerListener> = this.host.behaviors.getBehavior(BehaviorPoinerListener);
        if (!pointerListeners) throw new Error(`No BehaviorPoinerListener found!`);

        pointerListeners.onPointerDown.add(this.onPointDown);
        pointerListeners.onPointerUp.add(this.onPointUp);

        const rootPointerListeners: Nullable<BehaviorPoinerListener> = this.host.behaviors.getBehavior(BehaviorPoinerListener);
        if (!rootPointerListeners) throw new Error(`No BehaviorPoinerListener found on root!`);

        rootPointerListeners.onPointerMove.add(this.onPointMove);

        this.onDragStart.add(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.add(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.add(this.doSendDataToServerAndUpdateUi);
        this.onClick.add(this.doSendDataToServerAndUpdateUi);
    }

    doSendDataToServerAndUpdateUi = () => {
        this.host.simulator.channalIncrementalUpdate.clientSend({
            updatables: [
                this.host.generateUpdatePack(),
            ],
        });
        const pointerListeners: Nullable<BehaviorPoinerListener> = this.host.behaviors.getBehavior(BehaviorPoinerListener);
        pointerListeners?.onUiUpdate.emit();
        console.log("doSendDataToServerAndUpdateUi", "#" + this.host.uid, pointerListeners?.onUiUpdate.size);
    };

    onDestroy(): void {

        const pointerListeners: Nullable<BehaviorPoinerListener> = this.host.behaviors.getBehavior(BehaviorPoinerListener);
        if (pointerListeners) {
            pointerListeners.onPointerDown.remove(this.onPointDown);
            pointerListeners.onPointerUp.remove(this.onPointUp);
        }

        const rootPointerListeners: Nullable<BehaviorPoinerListener> = this.host.behaviors.getBehavior(BehaviorPoinerListener);
        if (rootPointerListeners) {
            rootPointerListeners.onPointerMove.remove(this.onPointMove);
        };

        this.onDragStart.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.remove(this.doSendDataToServerAndUpdateUi);
        this.onClick.remove(this.doSendDataToServerAndUpdateUi);
    }

    private started: boolean = false;
    private startHostPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private startPointerPosition: Vector2 = Vector2.INVALID_VECTOR2;
    private moved: boolean = false;

    onPointDown = (event: BehaviorPointerEvent) => {
        this.startHostPosition = this.host.position;
        this.startPointerPosition = event.position;
        this.moved = false;
        this.started = true;
    };

    onPointMove = (event: BehaviorPointerEvent) => {
        if (!this.started) return;
        if (!this.moved) {
            this.onDragStart.emit(this.startHostPosition);
            this.moved = true;
        }

        const currentPointerPosition = event.position;
        const delta = currentPointerPosition.sub(this.startPointerPosition);
        const currentHostPosition = this.startHostPosition.add(delta);
        this.host.position = currentHostPosition;
        this.onDragMove.emit(currentHostPosition);

    };

    onPointUp = (event: BehaviorPointerEvent) => {
        if (!this.started) return;
        if (this.moved) {
            const currentPointerPosition = event.position;
            const delta = currentPointerPosition.sub(this.startPointerPosition);
            const currentHostPosition = this.startHostPosition.add(delta);
            this.host.position = currentHostPosition;
            this.onDragMove.emit(currentHostPosition);
            this.onDragEnd.emit(currentHostPosition);
            console.log(`dragged`);
        } else {
            this.onClick.emit(this.startHostPosition);
            console.log(`clicked`);
        }

        this.started = false;
        this.startHostPosition = Vector2.INVALID_VECTOR2;
        this.startPointerPosition = Vector2.INVALID_VECTOR2;
        this.moved = false;
    };


}