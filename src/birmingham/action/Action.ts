import Card, { CARD_EMPTY } from "../Card";
import Factory from "../Factory";
import IndustrySlot from "../IndustrySlot";
import Player from "../Player";
import Traffic from "../traffic/Traffic";
import ActionType from "./ActionType";

export default abstract class Action {
    readonly type: ActionType;
    readonly player: Player;
    card: Card = CARD_EMPTY;

    constructor(type: ActionType, player: Player) {
        this.type = type;
        this.player = player;
    }

    isCardUsed(): boolean {
        return this.card !== null && this.card !== CARD_EMPTY;
    }

    useCard(card: Card): boolean {
        const result = this.canUseCard(card);
        if (result) {
            this.card = card;
        }
        return result;
    }

    abstract canUseCard(card: Card): boolean;

    abstract getHint(): string;

    abstract hasSelectedCard(card: Card): boolean;
    abstract hasSelectedTraffic(traffic: Traffic): boolean;
    abstract hasSelectedIndustrySlot(industrySlot: IndustrySlot): boolean;
    abstract hasSelectedFactory(factory: Factory): boolean;

    abstract canOperateCard(card: Card): boolean;
    abstract canOperateTraffic(traffic: Traffic): boolean;
    abstract canOperateIndustrySlot(industrySlot: IndustrySlot): boolean;
    abstract canOperateFactory(factory: Factory): boolean;

    abstract operateCard(card: Card): boolean;
    abstract operateTraffic(traffic: Traffic): boolean;
    abstract operateIndustrySlot(industrySlot: IndustrySlot): boolean;
    abstract operateFactory(factory: Factory): boolean;

    abstract canAct(): boolean;
}