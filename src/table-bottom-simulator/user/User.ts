import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import Updatable from "../io/Updatable";
import { deserializeVector2, serializeVector2 } from "../io/Utils";
import TableBottomSimulator from "../TableBottomSimulator";
import { generateColor } from "./Color";

export default class User implements Persistable, Updatable {
    
    readonly simulator: TableBottomSimulator;
    readonly uid: int;
    name: string;
    color: string;
    sight: Vector2;
    dirty: boolean = true;
    
    constructor(simulator: TableBottomSimulator, uid: int) {
        this.simulator = simulator;
        this.uid = uid;
        this.name = "Player" + uid;
        this.color = generateColor();
        this.sight = new Vector2(0, 0);
    }

    save() {
        return {
            uid: this.uid,
            color: this.color,
            name: this.name,
            sight: deserializeVector2(this.sight),
        };
    }

    restore(data: any): void {
        this.color = data.color;
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
    }

    generateUpdatePack(): any {
        return {
            uid: this.uid,
            color: this.color,
            name: this.name,
            sight: deserializeVector2(this.sight),
        };
    }
    
    receiveUpdatePack(data: any): void {
        this.color = data.color;
        this.name = data.name;
        this.sight = serializeVector2(data.sight);
    }
}