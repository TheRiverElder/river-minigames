// import { double, int } from "../../../libs/CommonTypes";
// import Item, { ItemModel } from "../item/Item";
// import { ContractDraftContext } from "./Contract";

// export default interface Trader {
//     readonly uid: int;
//     get name(): string;
//     // 获取能提供的最大数值
//     getGoods(context: ContractDraftContext): Array<Item>;
//     // 获取交易意向，值域在[0, +∞]，0代表完全不想交易，1代表可以交易，1以上代表自己赚爆 
//     getIntention(context: ContractDraftContext): double;

//     getDisplayedInfoModel(): TraderInfoModel;
// }

// export interface TraderModel {
//     readonly uid: int;
//     readonly name: string;
//     readonly goods: Array<ItemModel>;
//     readonly intention: double;
// }

// export interface TraderInfoModel {
//     readonly uid: int;
//     readonly name: string;
// }