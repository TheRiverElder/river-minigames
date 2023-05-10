import { filterNotNull } from "../../libs/lang/Collections";
import GameObject from "../gameobject/GameObject";
import { serializeVector2 } from "../io/Utils";
import Channel from "./Channel";

export interface ControlResult {
    saveControlData(): any;
}

export default class ControlChannel extends Channel {

    sendGameObjectControlData(gameObject: GameObject) {
        this.send({
            uid: gameObject.uid,
            position: serializeVector2(gameObject.position),
            size: serializeVector2(gameObject.size),
            rotation: gameObject.rotation,
            background: gameObject.background,
            shape: gameObject.shape,
            behaviors: filterNotNull(gameObject.behaviors.values()
                .map(b => ((b as any).saveControlData) 
                    ? (b as unknown as ControlResult).saveControlData() 
                    : null)),
        });
    }

    receive(data: any): void { }

}