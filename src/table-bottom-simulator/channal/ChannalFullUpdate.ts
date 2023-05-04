import Channal from "./Channal";
import TableBottomSimulator from "../TableBottomSimulator";

export default class ChannalFullUpdate extends Channal {

    readonly simulator: TableBottomSimulator;

    constructor(name: string, simulator: TableBottomSimulator) {
        super(name);
        this.simulator = simulator;
    }

    clientReceive(data: any): void {
        this.simulator.root.restore(data.root);
    }

    serverReceive(data: any): void { }

}