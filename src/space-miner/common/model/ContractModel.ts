import { int } from "../../../libs/CommonTypes";
import { ItemModel } from "../../model/item/Item";

export default interface ContractModel {
    readonly uid: int;
    readonly offering: Array<ItemModel>;
    readonly receiving: Array<ItemModel>;
}