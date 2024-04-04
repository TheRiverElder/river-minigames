import { mapModel } from "../../../libs/io/Displayable";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class GameQueryServerChannel extends ServerChannel {

    get name(): string {
        return "game_query";
    }

    override response(command: string, data?: any): any {
        const game = this.runtime.game;

        switch (command) {
            case Commands.GAME_QUERY.COMMAND_ORB: return game.world.orbs.getOrThrow(data).getDisplayedModel();
            case Commands.GAME_QUERY.COMMAND_ASSEMBLER: return game.world.orbs.getOrThrow(data).assembler.getDisplayedModel();
            case Commands.GAME_QUERY.COMMAND_CONTRACTS: return game.contracts.values().map(mapModel);
        }
    }

}