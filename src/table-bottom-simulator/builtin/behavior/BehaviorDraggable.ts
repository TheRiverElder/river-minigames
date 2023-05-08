import { DragEventListeners } from "../../../libs/drag/DragPointerEvent";
import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import ChannelControl from "../../channal/ChannelControl";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";

export default class BehaviorDraggable extends BehaviorAdaptor implements DragEventListeners {

    readonly onDragStart = new ListenerManager<Vector2>();
    readonly onDragMove = new ListenerManager<Vector2>();
    readonly onDragEnd = new ListenerManager<Vector2>();
    readonly onClick = new ListenerManager<Vector2>();

    enabled: boolean = true;


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
        this.host.simulator.channels.get("control")
            .ifPresent(channel => {
                if (!(channel instanceof ChannelControl)) return;
                channel.sendControlData({
                    uid: this.host.uid,
                    position: this.host.position,
                    size: this.host.size,
                    rotation: this.host.rotation,
                });
            });
        this.host.onUiUpdate.emit();
    };

}