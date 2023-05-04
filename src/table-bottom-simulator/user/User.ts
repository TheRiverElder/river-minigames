import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import Updatable from "../io/Updatable";
import { deserializeVector2, serializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulator";

export default class User implements Updatable {
    readonly simulator: TableBottomSimulator;
    readonly uid: int;
    name: string;
    sight: Vector2;
    dirty: boolean = true;
    
    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
        this.name = "Player" + uid;
        this.sight = new Vector2(0, 0);
    }

    generateUpdatePack(): any {
        return {
            uid: this.uid,
            name: this.name,
            sight: deserializeVector2(this.sight),
        };
    }
    
    receiveUpdatePack(data: any): void {
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
    }
}