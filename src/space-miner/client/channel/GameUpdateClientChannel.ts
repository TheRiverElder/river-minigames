import ListenerManager from "../../../libs/management/ListenerManager";
import Commands from "../../common/channel/Commands";
import { GameModel } from "../../model/global/Game";
import ClientChannel from "./ClientChannel";

export default class GameUpdateClientChannel extends ClientChannel {

    public readonly listeners = {
        UPDATE: new ListenerManager<GameModel>(),
    };

    get name(): string {
        return "game_update";
    }

    notifyUpdate() {
        this.send(Commands.GAME_UPDATE.UPDATE);
    }

    requestUpdate(): Promise<GameModel> {
        return this.request(Commands.GAME_UPDATE.UPDATE);
    }
    
    override receive(command: string, data?: any): any {
        switch (command) {
            case Commands.GAME_UPDATE.UPDATE: this.listeners.UPDATE.emit(data as GameModel); break;
        }
    }

}