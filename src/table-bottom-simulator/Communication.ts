import TableBottomSimulator from "./TableBottomSimulatorClient";

export default abstract class Communication {
    readonly simulator: TableBottomSimulator;

    constructor(simulator: TableBottomSimulator) {
        this.simulator = simulator;
    }

    sendPack(data: any): void {
        this.sendRawData(JSON.stringify(data));
    }

    abstract sendRawData(rawData: string): void;

    receiveRawData(rawData: string) {
        const json = JSON.parse(rawData);
        const channelName = json.channel;
        const channelData = json.data;
        const channel = this.simulator.channels.getOrThrow(channelName);
        channel.receive(channelData);
    }
}