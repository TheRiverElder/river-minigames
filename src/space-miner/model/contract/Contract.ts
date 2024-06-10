import { int } from "../../../libs/CommonTypes"
import Item, { ItemModel } from "../item/Item";


// export default interface Contract {
//     readonly uid: int;
    // readonly parties: Array<ContractParty>; // 数量应该只有2个
    // get completed(): boolean;
//     getDisplayedModel(): ContractModel;
// }

export default interface Contract {
    readonly uid: int;
    readonly offering: Array<Item>;
    readonly receiving: Array<Item>;
    getDisplayedModel(): ContractModel;
}

export interface ContractModel {
    readonly uid: int;
    readonly offering: Array<ItemModel>;
    readonly receiving: Array<ItemModel>;
}

// export interface ContractModel {
//     readonly uid: int;
//     readonly parties: Array<ContractPartyModel>;
//     readonly completed: boolean;
// }

// export interface ContractParty {
//     readonly trader: Trader;
//     completed: boolean;
//     offers: Array<Item>;
// }

// export interface ContractPartyModel {
//     readonly trader: int;
//     readonly completed: boolean;
//     readonly offers: Array<ItemModel>;
// }

// export interface ContractDraftContext {
//     readonly parties: Array<ContractParty>; 
// }

// export interface ContractDraftContextParty {
//     readonly trader: Trader;
//     offers: Array<Item>;
// }