import { constrains } from "../../../libs/math/Mathmatics";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class GameControlServerChannel extends ServerChannel {
    get name(): string {
        return "game_control";
    }

    override response(command: string, data?: any): any {
        switch (command) {
            case Commands.GAME_CONTROL.COMMAND_GET_TPS: return (1000 / this.runtime.timer.period);
        }
    }

    override receive(command: string, data?: any): void {
        switch (command) {
            case Commands.GAME_CONTROL.COMMAND_START: this.runtime.start(); break;
            case Commands.GAME_CONTROL.COMMAND_STOP: this.runtime.stop(); break;
            case Commands.GAME_CONTROL.COMMAND_GET_TPS: this.send(Commands.GAME_CONTROL.COMMAND_SET_TPS, (1000 / this.runtime.timer.period)); break;
            case Commands.GAME_CONTROL.COMMAND_SET_TPS: this.runtime.timer.period = constrains(1000 / data, 1, 1000); break;
        }
    }

}