import Channal from "./Channal";
import GameObject from "../gameobject/GameObject";
import TableBottomSimulator from "../TableBottomSimulator";

export default class ChannalFullUpdate extends Channal {

    readonly simulator: TableBottomSimulator;

    constructor(name: string, simulator: TableBottomSimulator) {
        super(name);
        this.simulator = simulator;
    }

    clientReceive(data: any): void {
        const root = GameObject.constructGameObject(this.simulator, data.root);
        root.restore(data.root);
        this.simulator.root = root;
    }

    serverReceive(data: any): void { }

}