import { int } from "../../../libs/CommonTypes";
import { AssemblingContextModel } from "../../model/assemble/Recipe";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class GameActionChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_FACILITY_ACCEPT_OPERATION = "facility_accept_operation";
    public static readonly COMMAND_OPEN_ASSEMBLER_UI = "open_assembler_ui";
    public static readonly COMMAND_CLOSE_ASSEMBLER_UI = "close_assembler_ui";
    public static readonly COMMAND_ASSEMBLE = "assemble";

    get name(): string {
        return "game_action";
    }

    sendSignalFacilityAcceptOperation(orbUid: int, facilityIndex: int, key: string) {
        this.send({
            command: GameActionChannel.COMMAND_FACILITY_ACCEPT_OPERATION,
            data: {
                orbUid,
                facilityIndex,
                key,
            },
        });
    }

    sendSignalOpenAssemblerUi(orbUid: int) {
        this.send({
            command: GameActionChannel.COMMAND_OPEN_ASSEMBLER_UI,
            data: orbUid,
        });
    }

    sendSignalCloseAssemblerUi(orbUid: int) {
        this.send({
            command: GameActionChannel.COMMAND_CLOSE_ASSEMBLER_UI,
            data: orbUid,
        });
    }

    sendSignalAssemble(orbUid: int, context: AssemblingContextModel) {
        this.send({
            command: GameActionChannel.COMMAND_ASSEMBLE,
            data: [orbUid, context],
        });
    }

}