import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Persistable from "../io/Persistable";
import Gamer from "../user/Gamer";
import User from "../user/User";
import BirminghamGame from "./BirminghamGame";

export default class BirminghamGamer implements Persistable {
    // income: int = 0;
    // account: int = 0;
    // score: int = 0;
    // cost: int = 0; // 记录回合花的钱

    constructor(
        public readonly game: BirminghamGame,
        public readonly gamerUid: int,
        public readonly ordinal: int,
        public money: int = 0,
    ) {
    }

    get gamer(): Nullable<Gamer> {
        return this.game.simulator.gamers.get(this.gamerUid).orNull()
    }

    get user(): Nullable<User> {
        return this.gamer?.user ?? null;
    }


    save() {
        return {
            gamerUid: this.gamerUid,
            ordinal: this.ordinal,
            money: this.money,
        };
    }

    restore(data: any): void {
        this.money = data.money;
    }
}

export interface BirminghamGamerData {
    gamerUid: int,
    ordinal: int,
    money: int,
}

export function restoreBirminghamGamer(data: BirminghamGamerData, game: BirminghamGame): BirminghamGamer {
    const gamer = new BirminghamGamer(game, data.gamerUid, data.ordinal);
    gamer.restore(data);
    return gamer;
}