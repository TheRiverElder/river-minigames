import CardType, { CARD_TYPE_EMPTY } from "./CardType";
import City, { CITY_EMPTY } from "./City";
import Industry, { INDUSTRY_EMPTY } from "./Industry";

export default class Card {
    readonly type: CardType;
    readonly industry: Industry;
    readonly city: City;
    
    constructor(type: CardType, industry: Industry, city: City) {
        this.type = type;
        this.industry = industry;
        this.city = city;
    }
}

export const CARD_EMPTY = new Card(CARD_TYPE_EMPTY, INDUSTRY_EMPTY, CITY_EMPTY);