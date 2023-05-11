import { double } from "../../../libs/CommonTypes";
import { DragEventListeners } from "../../../libs/drag/DragPointerEvent";
import ListenerManager from "../../../libs/management/ListenerManager";
import Vector2 from "../../../libs/math/Vector2";
import ControlChannel, { ControlResult } from "../../channal/ControlChannel";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import BehaviorType from "../../gameobject/BehaviorType";
import Side from "../../gameobject/Side";
import ConfigItem from "../../ui/config/ConfigItem";
import { CONFIG_ITEM_TYPE_BOOLEAN, CONFIG_ITEM_TYPE_NUMBER } from "../../ui/config/ConfigItems";

export const BEHAVIOR_TYPE_CONTROLLER = new BehaviorType("controller", Side.BOTH, (...args) => new ControllerBehavior(...args));

export default class ControllerBehavior extends BehaviorAdaptor implements DragEventListeners, ControlResult {

    readonly onDragStart = new ListenerManager<Vector2>();
    readonly onDragMove = new ListenerManager<Vector2>();
    readonly onDragEnd = new ListenerManager<Vector2>();
    readonly onClick = new ListenerManager<Vector2>();
    readonly onRotate = new ListenerManager<double>();
    readonly onResize = new ListenerManager<Vector2>();

    draggable: boolean = true;

    onInitialize(): void { 
        this.onDragStart.add(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.add(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.add(this.doSendDataToServerAndUpdateUi);
        this.onClick.add(this.doSendDataToServerAndUpdateUi);
        this.onRotate.add(this.doSendDataToServerAndUpdateUi);
        this.onResize.add(this.doSendDataToServerAndUpdateUi);
    }

    onDestroy(): void {
        this.onDragStart.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragMove.remove(this.doSendDataToServerAndUpdateUi);
        this.onDragEnd.remove(this.doSendDataToServerAndUpdateUi);
        this.onClick.remove(this.doSendDataToServerAndUpdateUi);
        this.onRotate.remove(this.doSendDataToServerAndUpdateUi);
        this.onResize.remove(this.doSendDataToServerAndUpdateUi);
    }


    doSendDataToServerAndUpdateUi = () => {
        // console.log("doSendDataToServerAndUpdateUi", this.onDragStart);
        this.host.simulator.channels.get("control")
            .ifPresent(channel => {
                if (!(channel instanceof ControlChannel)) return;
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

    get configItems(): ConfigItem<any>[] {
        return [
            new ConfigItem<boolean>("draggable", CONFIG_ITEM_TYPE_BOOLEAN, {
                get: () => this.draggable,
                set: (v) => {
                    this.draggable = v;
                    this.doSendDataToServerAndUpdateUi();
                },
            }),
        ];
    }

}