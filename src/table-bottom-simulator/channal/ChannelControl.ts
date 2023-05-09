import { filterNotNull } from "../../libs/lang/Collections";
import GameObject from "../gameobject/GameObject";
import { serializeVector2 } from "../io/Utils";
import Channel from "./Channel";

export interface ControlResult {
    saveControlData(): any;
}

export default class ChannelControl extends Channel {

    sendGameObjectControlData(gameobject: GameObject) {
        this.send({
            uid: gameobject.uid,
            position: serializeVector2(gameobject.position),
            size: serializeVector2(gameobject.size),
            rotation: gameobject.rotation,
            background: gameobject.background,
            shape: gameobject.shape,
            behaviors: filterNotNull(gameobject.behaviors.values()
                .map(b => ((b as any).saveControlData) 
                    ? (b as unknown as ControlResult).saveControlData() 
                    : null)),
        });
    }

    receive(data: any): void { }

}