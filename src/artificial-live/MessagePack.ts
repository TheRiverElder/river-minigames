import { double } from "../libs/CommonTypes";
import BasicType from "../libs/management/BasicType";

export class MessagePackType extends BasicType {

}

export default class MessagePack {
    readonly type: MessagePackType;
    readonly amount: double;

    constructor(type: MessagePackType, amount: double) {
        this.type = type;
        this.amount = amount;
    }

}