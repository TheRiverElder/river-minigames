import { double } from "../libs/CommonTypes";

export default class MessagePack {
    readonly type: string;
    readonly amount: double;

    constructor(type: string, amount: double) {
        this.type = type;
        this.amount = amount;
    }

}