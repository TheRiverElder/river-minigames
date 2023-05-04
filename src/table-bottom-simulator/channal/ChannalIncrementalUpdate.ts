import { int } from "../../libs/CommonTypes";
import Channal from "./Channal";
import TableBottomSimulator from "../TableBottomSimulator";

export default class ChannalIncrementalUpdate extends Channal {

    readonly simulator: TableBottomSimulator;

    constructor(name: string, simulator: TableBottomSimulator) {
        super(name);
        this.simulator = simulator;
    }

    clientReceive(data: any): void {
        for(const updatableData of data.gameObjects) {
            const uid: int = updatableData.uid;
            this.simulator.updatables.get(uid)
                .ifPresent(updatable => updatable.receiveUpdatePack(updatableData));
        }
    }

    serverReceive(data: any): void { }

}