import { int } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import ListenerManager from "../../../libs/management/ListenerManager";
import Channel from "../../simulator/Channel";
import BirminghamExtension from "../BirminghamExtension";
import BirminghamGame from "../BirminghamGame";

export interface ActionOptionsData {
    readonly text: string;
    readonly options: Array<{
        text: string;
        value?: number | string;
    }>;
}

export default class BirminghamInstructionChannel extends Channel {

    readonly listeners = {
        DISPLAY_ACTION_OPTIONS: new ListenerManager<ActionOptionsData>(),
        GAME_STATE_UPDATED: new ListenerManager<Nullable<BirminghamGame>>(),
    };

    constructor(
        public readonly extension: BirminghamExtension,
    ) {
        super("birmingham_instruction", extension.simulator);
    }

    receive(data: any): void {
        const d = data.data;
        switch (data.action) {
            case "display_action_options": this.listeners.DISPLAY_ACTION_OPTIONS.emit(d); break;
            case "update_game_state": {
                if (d) {
                    let game = this.extension.game;
                    if (!game) {
                        game = new BirminghamGame(this.extension);
                        this.extension.game = game;
                    }
                    game.restore(d);
                    this.listeners.GAME_STATE_UPDATED.emit(game);
                }
            } break;
        }
    }

    sendCommand(action: string, data: any = null) {
        this.send({ action, data });
    }

    sendChooseActionOption(data: { optionIndex: int }): void {
        this.sendCommand("choose_action_options", data);
    }

    sendRequestActionOption(): void {
        this.sendCommand("request_action_options");
    }

    sendRequestGameState(): void {
        this.sendCommand("request_game_state");
    }

    sendCreateGame(data: { gamerAmount: int }): void {
        this.sendCommand("create_game", data);
    }

    sendOrganizeMap(): void {
        this.sendCommand("organize_map");
    }

    sendResetActionOptions(): void {
        this.sendCommand("reset_action_options");
    }

    sendCreateEmptyCityObject(): void {
        this.sendCommand("create_empty_city_object");
    }

    sendCreateEmptyNetworkObject(): void {
        this.sendCommand("create_empty_network_object");
    }


}