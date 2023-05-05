import Channal from "./Channal";
import TableBottomSimulator from "../TableBottomSimulator";
import User from "../user/User";
import TableBottomSimulatorCommon from "../simulator/TableBottomSimulatorCommon";

export default class ChannalFullUpdate extends Channal {

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
        this.simulator.root.restore(data.root);
        for (const userData of data.users) {
            const user = new User(this.simulator, userData.uid);
            user.restore(userData);
            this.simulator.users.add(user);
        }
        if (this.simulator instanceof TableBottomSimulatorCommon) {
            this.simulator.user = this.simulator.users.getOrThrow(this.simulator.userUid);
        }
    }

    serverReceive(data: any, user: User): void {
        this.simulator.root.restore(data.root);
        for (const userData of data.users) {
            const user = new User(this.simulator, userData.uid);
            user.restore(userData);
            this.simulator.users.add(user);
        }

        this.simulator.users.values().forEach(u => {
            if (user === u) return;
            this.simulator.sendToClient(data, u);    
        });
        
    }

}