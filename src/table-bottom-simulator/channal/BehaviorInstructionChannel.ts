import { int } from "../../libs/CommonTypes";
import Behavior from "../gameobject/Behavior";
import Channel from "./Channel";

export default class BehaviorInstructionChannel extends Channel {

    override receive(data: any): void {
        const hostUid: int = data.hostUid;
        const behaviorUid: int = data.behaviorUid;
        const instruction: any = data.instruction;

        this.simulator.gameObjects.get(hostUid).ifPresent(gameObject => 
            gameObject.behaviors.get(behaviorUid).ifPresent(behavior => behavior.receiveInstruction(instruction))
        );
    }

    sendInstruction(behavior: Behavior, instruction: any) {
        const pack = {
            hostUid: behavior.host.uid,
            behaviorUid: behavior.uid,
            instruction: instruction,
        };

        this.send(pack);
    }

}