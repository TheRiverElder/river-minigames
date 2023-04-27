import { BiProductor } from "../../libs/CommonTypes";
import Card from "../Card";
import City from "../City";
import FactorySlot from "../FactorySlot";
import Game from "../Game";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import Traffic from "../traffic/Traffic";
import Action from "./Action";
import ActionEmpty from "./ActionEmpty";
import ActionScout from "./ActionScout";

export default class ActionType {
    readonly name: string;
    readonly creator: BiProductor<Game, Player, Action>;

    constructor(name: string, creator: BiProductor<Game, Player, Action>) {
        this.name = name;
        this.creator = creator;
    }

    create(game: Game, player: Player) {
        return this.creator(game, player);
    }
}

export const ACTION_TYPE_EMPTY: ActionType = new ActionType("<空>", (game, player) => new ActionEmpty(ACTION_TYPE_EMPTY, game, player));
export const ACTION_TYPE_SCOUT: ActionType = new ActionType("侦察", (game, player) => new ActionScout(ACTION_TYPE_SCOUT, game, player));

export interface ActionParams {
    city?: City;
    traffics?: Array<Traffic>;
    doneIndustrySlots?: Array<IndustrySlot>;
    factorySlots?: Array<FactorySlot>;
    cards?: Array<Card>;
}