import ListenerManager from "../../../libs/management/ListenerManager";
import { GameModel } from "../../model/global/Game";
import SpaceMinerChannel from "./SpaceMinerChannel";

export default class GameUpdateChannel extends SpaceMinerChannel<void, GameModel> {

    public readonly listeners = new ListenerManager<GameModel>();

    get name(): string {
        return "game_update";
    }

    sendSignal() {
        this.send();
    }
    
    receive(data: GameModel): void {
        this.listeners.emit(data);
    }

}