import { int } from "../../../libs/CommonTypes";
import ListenerManager from "../../../libs/management/ListenerManager";
import Channel from "../../channal/Channel";
import TableBottomSimulatorClient from "../../TableBottomSimulatorClient";
import BirminghamExtension from "../BirminghamExtension";

export interface ActionOptionsData {
    readonly text: string;
    readonly options: Array<{
        text: string;
        value?: number | string;
    }>;
}

export interface GameStateData {
    readonly period: int;
    readonly gamerList: Array<{
        ordinal: int;
        userUid: int;
        money: int;
        cardAmount: int;
        cardObjectUidList?: int;
    }>;
}

export default class BirminghamInstructionChannel extends Channel {

    readonly listeners = {
        DISPLAY_ACTION_OPTIONS: new ListenerManager<ActionOptionsData>(),
        UPDATE_GAME_STATE: new ListenerManager<GameStateData | null>(),
    };

    readonly extension: BirminghamExtension;

    constructor(name: string, simulator: TableBottomSimulatorClient, extension: BirminghamExtension) {
        super(name, simulator);
        this.extension = extension;
    }

    receive(data: any): void {
        const d = data.data;
        switch (data.type) {
            case "display_action_options": this.listeners.DISPLAY_ACTION_OPTIONS.emit(d); break;
            case "update_game_state": this.listeners.UPDATE_GAME_STATE.emit(d); break;
        }
    }

    sendCommand(type: string, data: any = null) {
        this.send({ type, data });
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

    sendOccupyGamer(data: { gamerOrdinal: int }): void {
        this.sendCommand("occupy_gamer", data);
    }


}