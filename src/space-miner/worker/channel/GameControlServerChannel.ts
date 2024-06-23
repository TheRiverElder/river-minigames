import { constrains } from "../../../libs/math/Mathmatics";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class GameControlServerChannel extends ServerChannel {
    get name(): string {
        return "game_control";
    }

    override receive(command: string, data?: any): any {
        switch (command) {
            case Commands.GAME_CONTROL.COMMAND_START: this.runtime.start(); break;
            case Commands.GAME_CONTROL.COMMAND_STOP: this.runtime.stop(); break;
            case Commands.GAME_CONTROL.COMMAND_GET_TPS: return (1000 / this.runtime.timer.period);            
            case Commands.GAME_CONTROL.COMMAND_SET_TPS: this.runtime.timer.period = constrains(1000 / data, 1, 1000); break;
        }
    }

}