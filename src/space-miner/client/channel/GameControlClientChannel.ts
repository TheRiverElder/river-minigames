import ListenerManager from "../../../libs/management/ListenerManager";
import Commands from "../../common/channel/Commands";
import ClientChannel from "./ClientChannel";

export default class GameControlClientChannel extends ClientChannel {

    public readonly listeners = {
        TPS_CHANGED: new ListenerManager<number>(),
    };


    get name(): string {
        return "game_control";
    }

    sendSignalStart() {
        this.send(Commands.GAME_CONTROL.COMMAND_START);
    }

    sendSignalStop() {
        this.send(Commands.GAME_CONTROL.COMMAND_STOP);
    }

    requestGetTps(): Promise<number> {
        return this.request<number>(Commands.GAME_CONTROL.COMMAND_GET_TPS);
    }

    sendSignalSetTps(tps: number) {
        return this.send(Commands.GAME_CONTROL.COMMAND_SET_TPS, tps);
    }
    
    override receive(command: string, data?: any): any { 
        switch(command) {
            case Commands.GAME_CONTROL.COMMAND_SET_TPS: {
                this.listeners.TPS_CHANGED.emit(data as number);
            } break;
        }
    }

}