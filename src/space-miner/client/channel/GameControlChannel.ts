import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class GameControlChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_START = "start";
    public static readonly COMMAND_STOP = "stop";
    public static readonly COMMAND_GET_TPS = "get_tps";
    public static readonly COMMAND_SET_TPS = "set_tps";

    get name(): string {
        return "game_control";
    }

    sendSignalStart() {
        this.send({ command: GameControlChannel.COMMAND_START });
    }

    sendSignalStop() {
        this.send({ command: GameControlChannel.COMMAND_STOP });
    }

    requestGetTps(): Promise<number> {
        return this.request({ command: GameControlChannel.COMMAND_GET_TPS });
    }

    sendSignalSetTps(tps: number) {
        this.send({ command: GameControlChannel.COMMAND_SET_TPS, data: tps });
    }
    
    receive(pack: CommandPack): void { }

}