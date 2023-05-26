import Card from "../Card";
import ActionAdapter from "./ActionAdapter";

export default class ActionLoan extends ActionAdapter {

    canUseCard(card: Card): boolean {
        return true;
    }

    canOperateCard(card: Card): boolean {
        return card !== this.card; 
    }

    canAct(): boolean {
        return !!this.card;
    }

}