import { double, int } from "../../../libs/CommonTypes"
import Item, { ItemModel } from "../item/Item";


export default interface Contract {
    readonly uid: int;
    readonly parties: Array<ContractParty>; // 数量应该只有2个
    get completed(): boolean;
    getDisplayedModel(): ContractModel;
}

export interface ContractModel {
    readonly uid: int;
    readonly parties: Array<ContractPartyModel>;
    readonly completed: boolean;
}

export interface ContractParty {
    readonly trader: Trader;
    completed: boolean;
    offers: Array<Item>;
}

export interface ContractPartyModel {
    readonly trader: int;
    readonly completed: boolean;
    readonly offers: Array<ItemModel>;
}

export interface Trader {
    readonly uid: int;
    get name(): string;
    // 获取交易意向，值域在[0, +∞]，0代表完全不想交易，1代表可以交易，1以上代表自己赚爆 
    getIntention(context: ContractDraftContext): double;
}

export interface ContractDraftContext {
    readonly parties: Array<ContractParty>; 
}

export interface ContractDraftContextParty {
    readonly trader: Trader;
    offers: Array<Item>;
}