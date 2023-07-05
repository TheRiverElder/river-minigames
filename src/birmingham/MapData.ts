import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";

export interface MapData {
    cities: Array<CityData>;
    links: Array<LinkData>;
}

export interface CityData {
    name: string;
    type: "industry" | "merchant";
    industrySlots: Array<IndustrySlotData>;
    merchants: Array<MerchantData>;
}

export interface LinkData {
    owner: Nullable<int>;
    head: string;
    tail: string;
}

export interface IndustrySlotData {
    industries: Array<string>;
    beerBonus: boolean;
}

export interface MerchantData {
    industries: Array<string>;
    factory: Nullable<FactoryData>;
}

export interface FactoryData {
    owner: int;
    flipped: boolean;
    industry: string;
}

export interface ProfileData {
    
}

export interface GameData {
    era: string;
}