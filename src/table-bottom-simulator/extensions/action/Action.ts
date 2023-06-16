import { ReactNode } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import CardBehavior from "../../builtin/behavior/CardBehavior";
import BirminghamBaseBehavior from "../behaviors/BirminghamBaseBehavior";
import BirminghamPlayer from "../BirminghamPlayer";
import ActionType from "./ActionType";

export default abstract class Action {
    readonly type: ActionType;
    readonly player: BirminghamPlayer;
    card: Nullable<CardBehavior> = null;

    constructor(type: ActionType, player: BirminghamPlayer) {
        this.type = type;
        this.player = player;
    }

    isCardUsed(): boolean {
        return this.card !== null;
    }

    useCard(card: CardBehavior): boolean {
        const result = this.canUseCard(card);
        if (result) {
            this.card = card;
        }
        return result;
    }

    abstract canUseCard(card: CardBehavior): boolean;

    abstract render(): ReactNode;

    canClick(behavior: BirminghamBaseBehavior): boolean {
        return false;
    }

    hasSelected(behavior: BirminghamBaseBehavior): boolean {
        return false;
    }
}