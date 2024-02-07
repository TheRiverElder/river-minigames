import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Persistable from "../io/Persistable";
import { deserializeVector2, serializeVector2 } from "../io/Utils";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import TableBottomSimulator from "../TableBottomSimulatorClient";
import Gamer from "./Gamer";

export default class User implements Persistable {
    
    destroyed: boolean = false;
    
    constructor(
        public readonly simulator: TableBottomSimulator, 
        public readonly uid: int,
        public name: string = "Anonymous Player",
        public sight: Vector2 = Vector2.zero(),
        public gamerUid: Nullable<int> = null,
        public isEditor: boolean = false,
    ) {
    }

    get gamer(): Nullable<Gamer> {
        if (this.gamerUid === null) return null;
        return this.simulator.gamers.get(this.gamerUid).orNull()
    }

    save() {
        return {
            uid: this.uid,
            name: this.name,
            sight: serializeVector2(this.sight),
            gamerUid: this.gamerUid,
            isEditor: this.isEditor,
            destroyed: this.destroyed,
        };
    }

    // 仅仅从客户端移除
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
        this.sight = deserializeVector2(data.sight);
        this.gamerUid = data.gamerUid;
        this.isEditor = !!data.isEditor;
    }

    receiveUpdatePack(data: any): void {
        if (!!data.destroyed) {
            this.remove();
            return;
        }
        // this.simulator.gamers.get(data.gamer).ifPresent(gamer => (this.role = gamer));
        this.name = data.name;
        this.sight = deserializeVector2(data.sight);
        this.gamerUid = data.gamerUid;
        this.isEditor = !!data.isEditor;
    }
}

export interface UserData {
    uid: int;
    name: string;
    sight: any;
    gamerUid: Nullable<int>;
    isEditor: boolean;
};

export function restoreUser(data: UserData, simulator: TableBottomSimulatorClient): User {
    const uid = data.uid;
    const user = new User(simulator, uid);
    user.restore(data);
    return user;
}