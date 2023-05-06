import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";
import { serializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulatorClient";

export default class User implements Persistable, Updatable {
    
    readonly simulator: TableBottomSimulator;
    readonly uid: int;
    name: string = "Anonymous Player";
    sight: Vector2 = Vector2.zero();
    color: string = "white";
    // role: Nullable<Gamer> = null;
    
    destroyed: boolean = false;
    
    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
    }

    remove() {
        this.simulator.users.remove(this);
    }

    restore(data: any): void {
        if (!!data.destroyed) {
            this.remove();
            return;
        }
        // this.simulator.gamers.get(data.gamer).ifPresent(gamer => (this.role = gamer));
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
        this.color = data.color;
    }

    receiveUpdatePack(data: any): void {
        if (!!data.destroyed) {
            this.remove();
            return;
        }
        // this.simulator.gamers.get(data.gamer).ifPresent(gamer => (this.role = gamer));
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
        this.color = data.color;
    }
}