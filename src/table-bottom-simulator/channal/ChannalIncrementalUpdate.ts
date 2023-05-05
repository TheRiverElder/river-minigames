import { int } from "../../libs/CommonTypes";
import Channal from "./Channal";
import TableBottomSimulator from "../TableBottomSimulator";
import User from "../user/User";

export default class ChannalIncrementalUpdate extends Channal {

    readonly simulator: TableBottomSimulator;

    constructor(name: string, simulator: TableBottomSimulator) {
        super(name);
        this.simulator = simulator;
    }
    
    clientSend(data: any): void {
        this.simulator.sendToServer({
            channal: this.name,
            data,
        });
    }

    serverSend(data: any, receiver: User): void {
        this.simulator.sendToClient({
            channal: this.name,
            data,
        }, receiver);
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