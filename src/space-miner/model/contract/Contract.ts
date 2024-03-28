import { int } from "../../../libs/CommonTypes"
import Profile from "../global/Profile"
import Item, { ItemModel } from "../item/Item";


export default interface Contract {
    readonly uid: int;
    readonly parties: Array<ContractParty>;
    get completed(): boolean;
    getDisplayedModel(): ContractModel;
}

export interface ContractModel {
    readonly uid: int;
    readonly parties: Array<ContractPartyModel>;
    readonly completed: boolean;
}

export interface ContractParty {
    readonly profile: Profile;
    completed: boolean;
    offers: Array<Item>;
    getDisplayedModel(): ContractPartyModel;
}

export interface ContractPartyModel {
    readonly profile: int;
    readonly completed: boolean;
    readonly offers: Array<ItemModel>;
}