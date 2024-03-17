import { constrains } from "../../../libs/math/Mathmatics";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class GameControlServerChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_START = "start";
    public static readonly COMMAND_STOP = "stop";
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

    receiveSetTps(tps: number) {
        this.runtime.timer.period = constrains(1000 / tps, 1, 1000);
    }

    receive(pack: CommandPack): void {
        const { command, data } = pack;
        switch (command) {
            case GameControlServerChannel.COMMAND_START: this.receiveSignalStart(); break;
            case GameControlServerChannel.COMMAND_STOP: this.receiveSignalStop(); break;
            case GameControlServerChannel.COMMAND_SET_TPS: this.receiveSetTps(data); break;
        }
    }

}