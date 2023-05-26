import { Productor } from "../../../libs/CommonTypes";
import BirminghamPlayer from "../BirminghamPlayer";
import Action from "./Action";
import ActionBuild from "./ActionBuild";
import ActionLoan from "./ActionLoan";
import ActionNetwork from "./ActionNetwork";
import ActionScout from "./ActionScout";
import ActionSell from "./ActionSell";

export default class ActionType {
    readonly name: string;
    readonly creator: Productor<BirminghamPlayer, Action>;

    constructor(name: string, creator: Productor<BirminghamPlayer, Action>) {
        this.name = name;
        this.creator = creator;
    }

    create(player: BirminghamPlayer) {
        return this.creator(player);
    }
    
}

export const ACTION_TYPE_BUILD: ActionType = new ActionType("build", (player) => new ActionBuild(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_LOAN: ActionType = new ActionType("loan", (player) => new ActionLoan(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_SELL: ActionType = new ActionType("sell", (player) => new ActionSell(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_NETWORK: ActionType = new ActionType("network", (player) => new ActionNetwork(ACTION_TYPE_SCOUT, player));
export const ACTION_TYPE_SCOUT: ActionType = new ActionType("scout", (player) => new ActionScout(ACTION_TYPE_SCOUT, player));