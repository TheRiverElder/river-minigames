import { filterNotNull } from "../libs/lang/Collections";
import { Nullable } from "../libs/lang/Optional";
import Vector2 from "../libs/math/Vector2";
import Factory from "./Factory";
import Industry from "./Industry";
import IndustrySlot from "./IndustrySlot";
import Market from "./Market";
import ResourceType from "./ResourceType";
import Traffic from "./traffic/Traffic";

export default class City {
    readonly name: string;
    readonly position: Vector2;
    readonly industrySlots: Array<IndustrySlot>;
    readonly traffics: Set<Traffic>;
    readonly market: Nullable<Market>;

    constructor(name: string, position: Vector2, industrySlots: Iterable<IndustrySlot>, traffics: Iterable<Traffic>, market: Nullable<Market>) {
        this.name = name;
        this.position = position;
        this.industrySlots = Array.from(industrySlots);
        this.traffics = new Set(traffics);
        this.market = market;
    }

    canAcceptIndustry(industry: Industry) {
        return this.industrySlots.some(slot => slot.industries.has(industry));
    }

    canAcceptCity(city: City) {
        return city === this || city === CITY_WILD;
    }


    getFactoryWithResource(resourceType: ResourceType): Nullable<Factory> {
        const factories = filterNotNull(this.industrySlots.map(it => it.factory));
        if (factories.length === 0) return null;
        return factories.find(factory => factory.resourceType === resourceType) || null;
    }

    getMarket(resourceType: ResourceType): Nullable<Market> {
        return this.market;
    }

}

export const CITY_EMPTY = new City("", Vector2.INVALID_VECTOR2, [], [], null);
export const CITY_WILD = new City("Wild", Vector2.INVALID_VECTOR2, [], [], null);