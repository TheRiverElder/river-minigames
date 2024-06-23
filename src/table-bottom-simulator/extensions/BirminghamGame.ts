import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import Persistable from "../io/Persistable";
import { Extension } from "../simulator/Extension";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";
import BirminghamGamer, { BirminghamGamerData, restoreBirminghamGamer } from "./BirminghamGamer";

export default class BirminghamGame implements Persistable {

    constructor(
        public readonly extension: Extension,
        public period: int = 0,
        public currentOrdinal: int = 0,
    ) {}
    
    get simulator(): TableBottomSimulatorClient {
        return this.extension.simulator;
    }

    public readonly gamerList: Array<BirminghamGamer> = [];

    getGamerByUserUid(uid: int): Nullable<BirminghamGamer> {
        const gamer = this.simulator.gamers.values().find(it => it.uid === uid)
        return this.gamerList.find(it => it.gamer === gamer) ?? null;
    }

    public readonly listeners = {
        GAME_STATE_UPDATED: new ListenerManager<BirminghamGame>(),
    }
    
    save() {
        return {
            period: this.period,
            currentOrdinal: this.currentOrdinal,
            gamerList: this.gamerList.map(it => it.save()),
        };
    }

    restore(data: any): void {
        this.period = data.period;
        this.currentOrdinal = data.currentOrdinal;
        this.gamerList.splice(0, this.gamerList.length, ...data.gamerList.map((it: any) => restoreBirminghamGamer(it, this)));
    }

}

export interface BirminghamGameData {
    period: int;
    currentOrdinal: int;
    gamerList: Array<BirminghamGamerData>;
}