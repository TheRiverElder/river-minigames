import CardType from "./CardType";
import City from "./City";
import Industry from "./Industry";

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