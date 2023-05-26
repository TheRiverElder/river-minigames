import { ReactNode } from "react";
import CardBehavior from "../../builtin/behavior/CardBehavior";
import Action from "./Action";

export default class ActionLoan extends Action {
    render(): ReactNode {
        throw new Error("Method not implemented.");
    }

    canUseCard(card: CardBehavior): boolean {
        return true;
    }

    // canOperateCard(card: Card): boolean {
    //     return card !== this.card; 
    // }

    // canAct(): boolean {
    //     return !!this.card;
    // }

}