import Channel from "../../channal/Channel";
import TableBottomSimulatorClient from "../../TableBottomSimulatorClient";
import BirminghamExtension from "../BirminghamExtension";

export default class BirminghamChannel extends Channel {

    readonly extension: BirminghamExtension;

    constructor(name: string, simulator: TableBottomSimulatorClient, extension: BirminghamExtension) {
        super(name, simulator);
        this.extension = extension;
    }

    receive(data: any): void {
        if (data.instruction === "confirm") {
            this.extension.buildCache();
        } else if (data.instruction === "options") {
            // TODO
        }
    }

}