import { int } from "../libs/CommonTypes";
import City, { CITY_EMPTY } from "./City";
import Industry, { INDUSTRY_EMPTY } from "./Industry";

export default class Card {
    readonly uid: int;
    readonly name: string;
    readonly city: City;
    readonly industry: Industry;

    constructor(uid: int, name: string, city: City, industry: Industry) {
        this.uid = uid;
        this.name = name;
        this.city = city;
        this.industry = industry;
    }
}

export const CARD_EMPTY = new Card(-1, "<empty>", CITY_EMPTY, INDUSTRY_EMPTY);