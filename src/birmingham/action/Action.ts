import Card, { CARD_EMPTY } from "../Card";
import FactorySlot from "../FactorySlot";
import Game from "../Game";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import ActionType from "./ActionType";

export default abstract class Action {
    readonly type: ActionType;
    readonly game: Game;
    readonly player: Player;
    card: Card = CARD_EMPTY;

    constructor(type: ActionType, game: Game, player: Player) {
        this.type = type;
        this.game = game;
        this.player = player;
    }

    abstract canUseCard(card: Card): boolean;
    abstract canSelectIndustrySlot(industrySlot: IndustrySlot): boolean;
    abstract canSelectFactorySlot(factorySlot: FactorySlot): boolean;
    abstract canAct(): boolean;
    abstract act(): void;
}