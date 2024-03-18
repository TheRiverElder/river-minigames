import { int } from "../../../libs/CommonTypes";
import { OrbModel } from "../../model/orb/Orb";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class GameQueryChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_ORB = "orb";

    get name(): string {
        return "game_query";
    }

    requestOrb(orbUid: int): Promise<OrbModel> {
        return this.request({ command: GameQueryChannel.COMMAND_ORB, data: orbUid });
    }

}