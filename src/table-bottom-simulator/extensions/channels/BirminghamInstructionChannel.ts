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

export default class BirminghamInstructionChannel extends Channel {

    readonly listeners = {
        DISPLAY_ACTION_OPTIONS: new ListenerManager<ActionOptionsData>(),
    };

    readonly extension: BirminghamExtension;

    constructor(name: string, simulator: TableBottomSimulatorClient, extension: BirminghamExtension) {
        super(name, simulator);
        this.extension = extension;
    }

    receive(data: any): void {
        if (data.type === "display_action_options") {
            this.receiveDisplayActionOption(data.data);
        }
    }

    receiveDisplayActionOption(data: ActionOptionsData): void {
        this.listeners.DISPLAY_ACTION_OPTIONS.emit(data);
    }

    sendChooseActionOption(index: int): void {
        this.send({
            type: "choose_action_options",
            data: index,
        });
    }

    sendRequestActionOption(): void {
        this.send({
            type: "request_action_options",
            data: null,
        });
    }


}