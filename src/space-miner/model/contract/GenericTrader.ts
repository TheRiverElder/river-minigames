import { Productor, double, int } from "../../../libs/CommonTypes";
import { sumBy } from "../../../libs/lang/Collections";
import Game from "../global/Game";
import Item from "../item/Item";
import { ContractDraftContext } from "./Contract";
import Trader, { TraderInfoModel } from "./Trader";

export default class GenericTrader implements Trader {

    constructor(
        public readonly uid: int,
        public readonly name: string,
        public readonly game: Game,
        protected readonly goodsSupplier: Productor<ContractDraftContext, Array<Item>>,
    ) { }

    getGoods(context: ContractDraftContext): Item[] {
        return this.goodsSupplier(context);
    }


    getShopPrice(item: Item): double {
        return this.game.shop.pricreOf(item);
    }

    getIntention(context: ContractDraftContext): double {
        const self = this.getSelfParty(context);
        const other = this.getOtherParty(context);

        const selfPrice = sumBy(self.offers, it => this.getShopPrice(it));
        const otherPrice = sumBy(other.offers, it => this.getShopPrice(it));

        if (selfPrice <= otherPrice) return 1;
        else return 0;
    }

    getSelfParty(context: ContractDraftContext) {
        if (context.parties.length !== 2) throw new Error("未识别的合同，合同成员只能有2个");
        if (context.parties[1].trader === this) return context.parties[0];
        else if (context.parties[0].trader === this) return context.parties[1];
        else throw new Error("不是合同成员：" + this);
    }

    getOtherParty(context: ContractDraftContext) {
        if (context.parties.length !== 2) throw new Error("未识别的合同，合同成员只能有2个");
        if (context.parties[0].trader === this) return context.parties[1];
        else if (context.parties[1].trader === this) return context.parties[0];
        else throw new Error("不是合同成员：" + this);
    }

    getDisplayedInfoModel(): TraderInfoModel {
        return {
            uid: this.uid,
            name: this.name,
        };
    }

}