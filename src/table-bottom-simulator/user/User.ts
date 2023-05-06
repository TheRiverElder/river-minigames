import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";
import { serializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import Gamer from "./Gamer";

export default class User implements Persistable, Updatable {
    
    readonly simulator: TableBottomSimulator;
    readonly uid: int;
    name: string = "Anonymous Player";
    gamer: Nullable<Gamer> = null;
    sight: Vector2 = Vector2.zero();
    
    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
    }

    restore(data: any): void {
        this.simulator.gamers.get(data.gamer).ifPresent(gamer => (this.gamer = gamer));
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
    }

    receiveUpdatePack(data: any): void {
        this.simulator.gamers.get(data.gamer).ifPresent(gamer => (this.gamer = gamer));
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
    }
}