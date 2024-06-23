import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class GameUpdateServerChannel extends ServerChannel {

    get name(): string {
        return "game_update";
    }

    sendUpdate() {
        this.send(Commands.GAME_UPDATE.UPDATE, this.runtime.game.getDisplayedModel());
    }
    
    override receive(command: string, data?: any): any {
        switch(command) {
            case Commands.GAME_UPDATE.UPDATE: return this.runtime.game.getDisplayedModel();
        }
    }

}