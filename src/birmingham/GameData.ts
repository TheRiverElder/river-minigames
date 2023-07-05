import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";

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
    cards: Array<string>;

    money: int;
    incomeLevel: int;
    incomePoints: int;
    totalGoals: int;

    ordinal: int;
    actionCounter: int;
    action: Nullable<ActionData>;
}

export interface ActionData {
    type: string;
    card: string;
    data: any;
}

export interface GameData {
    era: string;
    cities: Array<CityData>;
    links: Array<LinkData>;
}