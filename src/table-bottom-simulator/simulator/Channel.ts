import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";

export default abstract class Channel {
    readonly name: string;
    readonly simulator: TableBottomSimulatorClient;

    constructor(name: string, simulator: TableBottomSimulatorClient) {
        this.name = name;
        this.simulator = simulator;
    }

    send(data: any): void {
        const pack = {
            channel: this.name,
            data,
        };
        this.simulator.communication?.sendPack(pack);
    }

    abstract receive(data: any): void;
}