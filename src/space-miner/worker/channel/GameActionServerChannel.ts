import { int } from "../../../libs/CommonTypes";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerServerChannel from "./SpaceMinerServerChannel";


export default class GameActionServerChannel extends SpaceMinerServerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_FACILITY_ACCEPT_OPERATION = "facility_accept_operation";

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

        switch(command) {
            case GameActionServerChannel.COMMAND_FACILITY_ACCEPT_OPERATION: {
                this.receiveSignalFacilityAcceptOperation(data);
            } break;
        }
    }

}