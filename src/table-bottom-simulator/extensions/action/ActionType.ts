import { Productor } from "../../libs/CommonTypes";
import Card from "../Card";
import City from "../City";
import FactorySlot from "../FactorySlot";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import Traffic from "../traffic/Traffic";
import Action from "./Action";
import ActionBuild from "./ActionBuild";
import ActionEmpty from "./ActionEmpty";
import ActionLoan from "./ActionLoan";
import ActionNetwork from "./ActionNetwork";
import ActionScout from "./ActionScout";
import ActionSell from "./ActionSell";

export default class ActionType {
    readonly name: string;
    readonly creator: Productor<Player, Action>;

    constructor(name: string, creator: Productor<Player, Action>) {
        this.name = name;
        this.creator = creator;
    }

    create(player: Player) {
        return this.creator(player);
    }
    
}

export const ACTION_TYPE_EMPTY: ActionType = new ActionType("<empty>", (player) => new ActionEmpty(ACTION_TYPE_EMPTY, player));
export const ACTION_TYPE_BUILD: ActionType = new ActionType("build", (player) => new ActionBuild(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_LOAN: ActionType = new ActionType("loan", (player) => new ActionLoan(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_SELL: ActionType = new ActionType("sell", (player) => new ActionSell(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_NETWORK: ActionType = new ActionType("network", (player) => new ActionNetwork(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_SCOUT: ActionType = new ActionType("scout", (player) => new ActionScout(ACTION_TYPE_SCOUT, player));

export interface ActionParams {
    city?: City;
    traffics?: Array<Traffic>;
    doneIndustrySlots?: Array<IndustrySlot>;
    factorySlots?: Array<FactorySlot>;
    cards?: Array<Card>;
}