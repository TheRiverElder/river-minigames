import { int } from "../libs/CommonTypes";
import { ActionParams } from "./action/ActionType";
import GameMap from "./GameMap";
import Market from "./Market";
import Player from "./Player";
import ResourceType from "./ResourceType";

export default class Game {
    readonly map: GameMap;
    readonly players: Array<Player>;
    readonly markets: Map<ResourceType, Market>;
    turnIndex: int;

    constructor(map: GameMap, players: Array<Player>, markets: Map<ResourceType, Market>, turnIndex: int) {
        this.map = map;
        this.players = Array.from(players);
        this.markets = markets;
        this.turnIndex = turnIndex;
    }

    actionArgs: ActionParams = {};

    getCurrentPlayer(): Player {
        const player = this.players[this.turnIndex];
        if (!player) throw new Error("d当前没有玩家！");
        return player;
    }

    turn() {
        this.turnIndex++;
        this.turnIndex %= this.players.length;
    }
}