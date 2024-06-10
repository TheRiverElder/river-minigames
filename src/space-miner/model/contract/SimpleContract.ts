import { int } from "../../../libs/CommonTypes";
import Item from "../item/Item";
import Contract, { ContractModel } from "./Contract";

export default class SimpleContract implements Contract {
    constructor(
        public readonly uid: int, 
        public readonly offering: Array<Item>, 
        public readonly receiving: Array<Item>, 
    ) { }

    getDisplayedModel(): ContractModel {
        return {
            uid: this.uid,
            offering: this.offering.map(it => it.getDisplayedModel()),
            receiving: this.receiving.map(it => it.getDisplayedModel()),
        };
    }
}