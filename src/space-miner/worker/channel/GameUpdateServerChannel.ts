import { GameModel } from "../../model/global/Game";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class GameUpdateServerChannel extends SpaceMinerChannel<GameModel, void> {

    get name(): string {
        return "game_update";
    }

    sendGameUpdate() {
        const data = this.runtime.game.getDisplayedModel();
        this.send(data);
    }
    
    receive(): void {
        this.sendGameUpdate();
    }

}