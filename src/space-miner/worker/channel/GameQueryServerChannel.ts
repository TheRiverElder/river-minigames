import { mapModel } from "../../../libs/io/Displayable";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class GameQueryServerChannel extends SpaceMinerChannel<any, CommandPack> {

    public static readonly COMMAND_ORB = "orb";
    public static readonly COMMAND_ASSEMBLER = "assembler";
    public static readonly COMMAND_CONTRACTS = "contracts";

    get name(): string {
        return "game_query";
    }

    response(id: number, pack: CommandPack<any>): void {
        const { command, data } = pack;
        const game = this.runtime.game;

        switch (command) {
            case GameQueryServerChannel.COMMAND_ORB: {
                const responseData = game.world.orbs.getOrThrow(data).getDisplayedModel();
                this.send(responseData, id);
            } break;
            case GameQueryServerChannel.COMMAND_ASSEMBLER: {
                const responseData = game.world.orbs.getOrThrow(data).assembler.getDisplayedModel();
                this.send(responseData, id);
            } break;
            case GameQueryServerChannel.COMMAND_CONTRACTS: {
                const responseData = game.contracts.values().map(mapModel);
                this.send(responseData, id);
            } break;
        }
    }

}