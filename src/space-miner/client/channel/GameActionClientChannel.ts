import { int } from "../../../libs/CommonTypes";
import ClientChannel from "./ClientChannel";
import Commands from "../../common/channel/Commands";

export default class GameActionClientChannel extends ClientChannel {

    get name(): string {
        return "game_action";
    }

    sendFacilityAcceptOperation(orbUid: int, facilityIndex: int, key: string) {
        this.send(Commands.GAME_ACTION.FACILITY_ACCEPT_OPERATION, {
            orbUid,
            facilityIndex,
            key,
        });
    }

}