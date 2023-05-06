import { double, int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import { serializeVector2 } from "../io/Utils";
import Channel from "./Channel";

export interface ControlData {
    uid: int;
    position: Vector2;
    size: Vector2;
    rotation: double;
}

export default class ChannelControl extends Channel {

    sendControlData(data: ControlData) {
        this.send({
            uid: data.uid,
            position: serializeVector2(data.position),
            size: serializeVector2(data.size),
            rotation: data.rotation,
        });
    }

    receive(data: any): void { }

}