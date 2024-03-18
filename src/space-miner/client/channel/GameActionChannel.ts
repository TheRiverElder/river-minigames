import { int } from "../../../libs/CommonTypes";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class GameActionChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_FACILITY_ACCEPT_OPERATION = "facility_accept_operation";

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

}