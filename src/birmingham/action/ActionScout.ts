import Card, { CARD_EMPTY } from "../Card";
import ActionAdapter from "./ActionAdapter";

export default class ActionScout extends ActionAdapter {

    readonly extraCards: Set<Card> = new Set();

    canUseCard(card: Card): boolean {
        return true;
    }

    getHint(): string {
        return "请额外选择2张手牌丢弃";
    }

    hasSelectedCard(card: Card): boolean {
        return this.extraCards.has(card);
    }

    canOperateCard(card: Card): boolean {
        if (card === this.card) return false;
        if (this.extraCards.size < 2) return true;
        return this.extraCards.has(card); 
    }

    operateCard(card: Card): boolean {
        if (card === this.card) return false;
        if (this.extraCards.has(card)) {
            this.extraCards.delete(card);
            return true;
        } else {
            if (this.extraCards.size >= 2) return false;
            this.extraCards.add(card);
            return true;
        }
    }

    canAct(): boolean {
        return (
            !!this.card && 
            this.card !== CARD_EMPTY && 
            this.extraCards.size === 2 && 
            !this.extraCards.has(this.card)
        );
    }

}