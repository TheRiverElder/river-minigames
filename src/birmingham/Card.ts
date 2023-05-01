import City, { CITY_EMPTY } from "./City";
import Industry, { INDUSTRY_EMPTY } from "./Industry";

export default class Card {
    readonly name: string;
    readonly city: City;
    readonly industry: Industry;

    constructor(name: string, city: City, industry: Industry) {
        this.name = name;
        this.city = city;
        this.industry = industry;
    }
}

export const CARD_EMPTY = new Card("<empty>", CITY_EMPTY, INDUSTRY_EMPTY);