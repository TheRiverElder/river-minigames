import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import User from "../user/User";

export default abstract class Channal {
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
        this.simulator.communication?.sendPack(data);
    }

    abstract receive(data: any): void;
}