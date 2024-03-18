import { int } from "../../../libs/CommonTypes";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class GameQueryServerChannel extends SpaceMinerChannel<any, CommandPack> {

    public static readonly COMMAND_ORB = "orb";

    get name(): string {
        return "game_query";
    }

    responseOrb(orbUid: int) {
        this.request({ command: GameQueryServerChannel.COMMAND_ORB, data: orbUid });
    }

    response(id: number, pack: CommandPack<any>): void {
        const { command, data } = pack;

        switch (command) {
            case GameQueryServerChannel.COMMAND_ORB: this.send(this.runtime.game.world.orbs.getOrThrow(data).getDisplayedModel(), id); break;
        }
    }

}