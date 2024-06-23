import { int } from "../../../libs/CommonTypes";
import { filterNotNull } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import Vector2 from "../../../libs/math/Vector2";
import CardBehavior, { Card } from "../../builtin/behavior/CardBehavior";
import GameObject from "../gameobject/GameObject";
import Persistable from "../../io/Persistable";
import { deserializeVector2, serializeVector2 } from "../../io/Utils";
import User from "./User";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";

export default class Gamer implements Persistable {

    constructor(
        public readonly simulator: TableBottomSimulatorClient,
        public readonly uid: int,
        public home: Vector2 = Vector2.zero(),
        public userUid: Nullable<int> = null,
        public color: string = "white",
        public cardObjectUidList: Array<int> = [],
        public cardAmount: int = 0,
    ) { }

    get user(): Nullable<User> {
        if (this.userUid === null) return null;
        return this.simulator.users.get(this.userUid).orNull();
    }

    get cardObjects(): Array<GameObject> {
        return filterNotNull(this.cardObjectUidList.map(uid => this.simulator.gameObjects.get(uid).orNull()));
    }

    get cards(): Array<Card> {
        return filterNotNull(this.cardObjects.map(obj => obj.getBehaviorByType(CardBehavior.TYPE)?.card ?? null));
    }


    save() {
        return {
            uid: this.uid,
            home: serializeVector2(this.home),
            userUid: this.userUid,
            color: this.color,
            cardAmount: this.cardAmount,
            cardObjectUidList: this.cardObjectUidList.slice(),
        };
    }
    
    restore(data: any): void {
        this.home = deserializeVector2(data.home);
        this.userUid = data.userUid;
        this.color = data.color;
        this.cardAmount = data.cardAmount;
        this.cardObjectUidList = data.cardObjectUidList?.slice() ?? [];
    }

}

export interface GamerData {
    uid: int;
    userUid: Nullable<int>;
    color: string;
    cardAmount: int;
    cardObjectUidList: Array<int>;
};

export function restoreGamer(data: GamerData, simulator: TableBottomSimulatorClient): Gamer {
    const uid = data.uid;
    const gamer = new Gamer(simulator, uid);
    gamer.restore(data);
    return gamer;
}