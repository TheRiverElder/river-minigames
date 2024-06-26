import { double } from "../../../libs/CommonTypes";
import { DragEventListeners } from "../../../libs/drag/DragPointerEvent";
import { Nullable } from "../../../libs/lang/Optional";
import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import BooleanConfigItem from "../../ui/config/BooleanConfigItem";
import ConfigItem from "../../ui/config/ConfigItem";
import User from "../../simulator/user/User";
import BehaviorAdaptor from "../../simulator/gameobject/BehaviorAdaptor";
import BehaviorType from "../../simulator/gameobject/BehaviorType";
import Side from "../../simulator/gameobject/Side";

export default class ControllerBehavior extends BehaviorAdaptor implements DragEventListeners {
    
    static readonly EVENT_DRAG_START = "drag_start";
    static readonly EVENT_DRAG_MOVE = "drag_move";
    static readonly EVENT_DRAG_END = "drag_end";

    static readonly TYPE = new BehaviorType("controller", Side.BOTH, (...args) => new ControllerBehavior(...args));

    readonly onDragStartListeners = new ListenerManager<Vector2>();
    readonly onDragMoveListeners = new ListenerManager<Vector2>();
    readonly onDragEndListeners = new ListenerManager<Vector2>();
    readonly onClickListeners = new ListenerManager<Vector2>();
    readonly onRotateListeners = new ListenerManager<double>();
    readonly onResizeListeners = new ListenerManager<Vector2>();

    draggable: boolean = true;
    controller: Nullable<User> = null;

    override onInitialize(): void { 
        // this.onDragStartListeners.add(this.doSendDataToServerAndUpdateUi);
        // this.onDragMoveListeners.add(this.doSendDataToServerAndUpdateUi);
        // this.onDragEndListeners.add(this.doSendDataToServerAndUpdateUi);
        this.onClickListeners.add(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);
        this.onRotateListeners.add(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);
        this.onResizeListeners.add(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);

        this.onDragStartListeners.add(this.onDragStart);
        this.onDragMoveListeners.add(this.onDragMove);
        this.onDragEndListeners.add(this.onDragEnd);
    }

    override onDestroy(): void {
        // this.onDragStartListeners.remove(this.doSendDataToServerAndUpdateUi);
        // this.onDragMoveListeners.remove(this.doSendDataToServerAndUpdateUi);
        // this.onDragEndListeners.remove(this.doSendDataToServerAndUpdateUi);
        this.onClickListeners.remove(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);
        this.onRotateListeners.remove(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);
        this.onResizeListeners.remove(this.doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions);

        this.onDragStartListeners.remove(this.onDragStart);
        this.onDragMoveListeners.remove(this.onDragMove);
        this.onDragEndListeners.remove(this.onDragEnd);
    }

    private onDragStart = (position: Vector2) => this.sendInstruction({
        eventType: ControllerBehavior.EVENT_DRAG_START,
        position,
    });

    private onDragMove = (position: Vector2) => {
        console.log("onDragMove", position);
        this.host.position = position;
        this.host.onUiUpdateListeners.emit();
        this.sendInstruction({
            eventType: ControllerBehavior.EVENT_DRAG_MOVE,
            position,
        });
    }

    private onDragEnd = (position: Vector2) => this.sendInstruction({
        eventType: ControllerBehavior.EVENT_DRAG_END,
        position,
    });

    doSendGameObjectSelfDataToServerAndUpdateUiWithoutOptions = () => {
        this.host.doSendGameObjectSelfDataToServerAndUpdateUi();
    };

    override save(): any {
        return {
            ...super.save(),
            draggable: this.draggable,
            controller: this.controller?.uid || -1,
        };
    }

    override restore(data: any): void { 
        super.restore(data);
        this.draggable = !!data.draggable;
        if (data.controller > 0) {
            this.simulator.users.get(data.controller).ifPresent(controller => (this.controller = controller));
        } else if (data.controller < 0) {
            this.controller = null;
        }
    }

    override get configItems(): ConfigItem<any>[] {
        return [
            new BooleanConfigItem("draggable", {
                get: () => this.draggable,
                set: this.createSetterAndSendUpdater(v => this.draggable = v),
            }),
        ];
    }

}