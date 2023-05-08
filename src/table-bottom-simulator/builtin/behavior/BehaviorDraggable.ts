import { DragEventListeners } from "../../../libs/drag/DragPointerEvent";
import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import ChannelControl, { ControlResult } from "../../channal/ChannelControl";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import BehaviorType from "../../gameobject/BehaviorType";
import Side from "../../gameobject/Side";

export const BEHAVIOR_TYPE_DRAGGABLE = new BehaviorType("draggable", Side.BOTH, (...args) => new BehaviorDraggable(...args));

export default class BehaviorDraggable extends BehaviorAdaptor implements DragEventListeners, ControlResult {

    readonly onDragStart = new ListenerManager<Vector2>();
    readonly onDragMove = new ListenerManager<Vector2>();
    readonly onDragEnd = new ListenerManager<Vector2>();
    readonly onClick = new ListenerManager<Vector2>();

    draggable: boolean = true;

    onInitialize(): void { 
        this.onDragStart.add(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.add(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.add(this.doSendDataToServerAndUpdateUi);
        this.onClick.add(this.doSendDataToServerAndUpdateUi);
    }

    onDestroy(): void {
        this.onDragStart.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.remove(this.doSendDataToServerAndUpdateUi);
        this.onClick.remove(this.doSendDataToServerAndUpdateUi);
    }


    doSendDataToServerAndUpdateUi = () => {
        console.log("doSendDataToServerAndUpdateUi", this.onDragStart);
        this.host.simulator.channels.get("control")
            .ifPresent(channel => {
                if (!(channel instanceof ChannelControl)) return;
                channel.sendGameObjectControlData(this.host);
            });
        this.host.onUiUpdate.emit();
    };

    restore(data: any): void { 
        this.draggable = !!data.draggable;
    }

    saveControlData() {
        return {
            uid: this.uid,
            type: this.type.name,
            draggable: this.draggable,
        };
    }

    receiveUpdatePack(data: any): void { 
        this.draggable = !!data.draggable;
    }

}