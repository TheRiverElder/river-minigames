import { removeFromArray } from "../../libs/lang/Collections";
import Card from "../Card";
import { CARD_TYPE_CITY, CARD_TYPE_INDUSTRY } from "../CardType";
import { CITY_EMPTY, CITY_WILD } from "../City";
import FactorySlot from "../FactorySLot";
import { INDUSTRY_ANY, INDUSTRY_EMPTY } from "../Industry";
import IndustrySlot from "../IndustrySlot";
import Action from "./Action";

export default class ActionScout extends Action {

    readonly extraCards: Array<Card> = [];


    canUseCard(card: Card): boolean {
        return true;
    }

    canSelectIndustrySlot(industrySlot: IndustrySlot): boolean {
        return false;
    }
    
    canSelectFactorySlot(factorySlot: FactorySlot): boolean {
        return false;
    }

    canAct(): boolean {
        if (this.extraCards.length !== 2) return false;
        return true;
    }

    act(): void {
        if (this.extraCards.length !== 2) return;
        this.extraCards.forEach(card => removeFromArray(this.player.cards, card));
        this.player.cards.push(
            new Card(CARD_TYPE_INDUSTRY, INDUSTRY_ANY, CITY_EMPTY),
            new Card(CARD_TYPE_CITY, INDUSTRY_EMPTY, CITY_WILD),
        );
    }

}