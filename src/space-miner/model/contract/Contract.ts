import { int } from "../../../libs/CommonTypes"
import Profile from "../global/Profile"
import Item from "../item/Item";


export default interface Contract {
    readonly uid: int;
    readonly parties: Array<ContractParty>;
    get completed(): boolean;
}

export interface ContractParty {
    readonly profile: Profile;
    completed: boolean;
    offers: Array<Item>;
}