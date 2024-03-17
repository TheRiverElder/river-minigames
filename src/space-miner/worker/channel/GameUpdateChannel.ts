import ListenerManager from "../../../libs/management/ListenerManager";
import { GameModel } from "../../Game";
import SpaceMinerChannel from "./SpaceMinerChannel";

export default class GameUpdateChannel extends SpaceMinerChannel<void, GameModel> {

    public readonly listener = new ListenerManager<GameModel>();

    get name(): string {
        return "game_update";
    }

    sendSignal() {
        this.send();
    }
    
    receive(data: GameModel): void {
        this.listener.emit(data);
    }

}