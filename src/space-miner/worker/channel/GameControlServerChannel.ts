import { constrains } from "../../../libs/math/Mathmatics";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class GameControlServerChannel extends SpaceMinerChannel<any, CommandPack> {

    public static readonly COMMAND_START = "start";
    public static readonly COMMAND_STOP = "stop";
    public static readonly COMMAND_GET_TPS = "get_tps";
    public static readonly COMMAND_SET_TPS = "set_tps";

    get name(): string {
        return "game_control";
    }

    receiveSignalStart() {
        this.runtime.start();
    }

    receiveSignalStop() {
        this.runtime.stop();
    }

    responseGetTps(id: number) {
        this.send(1000 / this.runtime.timer.period, id);
    }

    receiveSetTps(tps: number) {
        this.runtime.timer.period = constrains(1000 / tps, 1, 1000);
    }

    response(id: number, pack: CommandPack<any>): void {
        const { command, data } = pack;
        switch (command) {
            case GameControlServerChannel.COMMAND_GET_TPS: this.responseGetTps(id); break;
        }
    }

    receive(pack: CommandPack): void {
        const { command, data } = pack;
        switch (command) {
            case GameControlServerChannel.COMMAND_START: this.receiveSignalStart(); break;
            case GameControlServerChannel.COMMAND_STOP: this.receiveSignalStop(); break;
            case GameControlServerChannel.COMMAND_SET_TPS: this.receiveSetTps(data); break;
            case GameControlServerChannel.COMMAND_SET_TPS: this.receiveSetTps(data); break;
        }
    }

}