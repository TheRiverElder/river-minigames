import { int } from "../../../libs/CommonTypes";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import { AssemblingContextModel } from "../../model/assemble/Recipe";
import SpaceMinerServerChannel from "./SpaceMinerServerChannel";


export default class GameActionServerChannel extends SpaceMinerServerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_FACILITY_ACCEPT_OPERATION = "facility_accept_operation";
    public static readonly COMMAND_OPEN_ASSEMBLER_UI = "open_assembler_ui";
    public static readonly COMMAND_CLOSE_ASSEMBLER_UI = "close_assembler_ui";
    public static readonly COMMAND_ASSEMBLE = "assemble";

    get name(): string {
        return "game_action";
    }

    receiveSignalFacilityAcceptOperation(args: { orbUid: int, facilityIndex: int, key: string }) {
        const {orbUid, facilityIndex, key} = args;
        const orb = this.runtime.game.world.orbs.get(orbUid).get();
        if (!orb) return;
        const facility = orb.facilities[facilityIndex];
        if (!facility) return;

        facility.acceptOperation(key);
    }

    override receive(pack: CommandPack): void {
        const { command, data } = pack;
        const game = this.runtime.game;

        switch(command) {
            case GameActionServerChannel.COMMAND_FACILITY_ACCEPT_OPERATION: {
                this.receiveSignalFacilityAcceptOperation(data);
            } break;
            case GameActionServerChannel.COMMAND_OPEN_ASSEMBLER_UI: {
                game.actions.openAssemblerUi(game.world.orbs.getOrThrow(data));
            } break;
            case GameActionServerChannel.COMMAND_CLOSE_ASSEMBLER_UI: {
                game.actions.closeAssemblerUi(game.world.orbs.getOrThrow(data));
            } break;
            case GameActionServerChannel.COMMAND_ASSEMBLE: {
                const [orbUid, context] = data as [int, AssemblingContextModel];
                game.world.orbs.getOrThrow(orbUid).assembler.assemble(context);
            } break;
        }
    }

}