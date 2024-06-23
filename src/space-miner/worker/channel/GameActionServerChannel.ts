import { int } from "../../../libs/CommonTypes";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";


export default class GameActionServerChannel extends ServerChannel {

    get name(): string {
        return "game_action";
    }

    receiveFacilityAcceptOperation(args: { orbUid: int, facilityIndex: int, key: string }) {
        const {orbUid, facilityIndex, key} = args;
        const orb = this.runtime.game.world.orbs.get(orbUid).get();
        if (!orb) return;
        const facility = orb.facilities[facilityIndex];
        if (!facility) return;

        facility.acceptOperation(key);
    }

    override receive(command: string, data?: any): any {
        switch(command) {
            case Commands.GAME_ACTION.FACILITY_ACCEPT_OPERATION: {
                this.receiveFacilityAcceptOperation(data);
            } break;
        }
    }

}