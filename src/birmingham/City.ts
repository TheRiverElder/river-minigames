import Vector2 from "../libs/math/Vector2";
import Industry from "./Industry";
import IndustrySlot from "./IndustrySlot";
import Traffic from "./traffic/Traffic";

export default class City {
    readonly name: string;
    readonly position: Vector2;
    readonly industrySlots: Array<IndustrySlot>;
    readonly traffics: Set<Traffic>;

    constructor(name: string, position: Vector2, industrySlots: Iterable<IndustrySlot>, traffics: Iterable<Traffic>) {
        this.name = name;
        this.position = position;
        this.industrySlots = Array.from(industrySlots);
        this.traffics = new Set(traffics);
    }

    canAcceptIndustry(industry: Industry) {
        return this.industrySlots.some(slot => slot.industries.has(industry));
    }

    canAcceptCity(city: City) {
        return city === this || city === CITY_WILD;
    }

}

export const CITY_EMPTY = new City("", Vector2.INVALID_VECTOR2, [], []);
export const CITY_WILD = new City("Wild", Vector2.INVALID_VECTOR2, [], []);