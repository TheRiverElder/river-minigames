import { Supplier, int } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Profile from "../global/Profile";
import Item from "../item/Item";
import { ContractDraftContext } from "./Contract";
import Trader, { TraderInfoModel } from "./Trader";

export default class ProfileTrader implements Trader {

    constructor(
        public readonly profile: Profile,
    ) { }

    public goodsSupplier: Nullable<Supplier<Array<Item>>> = null;

    get uid(): int {
        return -1;
    }

    get name(): string {
        return this.profile.name;
    }

    getGoods(context: ContractDraftContext): Item[] {
        return this.goodsSupplier?.() ?? [];
    }

    getIntention(context: ContractDraftContext): number {
        return 1;
    }

    getDisplayedInfoModel(): TraderInfoModel {
        return {
            uid: this.uid,
            name: this.name,
        };
    }

}