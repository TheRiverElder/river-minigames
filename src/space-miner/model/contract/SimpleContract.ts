import { int } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import Item from "../item/Item";
import Contract, { ContractModel } from "./Contract";

export default class SimpleContract implements Contract {
    constructor(
        public readonly uid: int, 
        public readonly description: Text, 
        public readonly offering: Array<Item>, 
        public readonly receiving: Array<Item>, 
    ) { }

    getDisplayedModel(): ContractModel {
        return {
            uid: this.uid,
            description: this.description.getDisplayedModel(),
            offering: this.offering.map(it => it.getDisplayedModel()),
            receiving: this.receiving.map(it => it.getDisplayedModel()),
        };
    }
}