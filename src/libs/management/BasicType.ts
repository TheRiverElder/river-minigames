import { Productor } from "../CommonTypes";

export default class BasicType {

    public static readonly KEY_MAPPER: Productor<BasicType, string> = it => it.id;

    public readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}