import { removeFromArray } from "../../libs/lang/Collections";
import Card from "../Card";
import { CITY_EMPTY, CITY_WILD } from "../City";
import FactorySlot from "../FactorySlot";
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
            new Card(INDUSTRY_ANY.name, CITY_EMPTY, INDUSTRY_ANY),
            new Card(CITY_WILD.name, CITY_WILD, INDUSTRY_EMPTY),
        );
    }

}