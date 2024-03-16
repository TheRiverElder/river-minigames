import { Productor } from "../CommonTypes";

export default class BasicType {

    public static readonly KEY_MAPPER: Productor<BasicType, string> = it => it.id;

    constructor(
        public readonly id: string,
    ) { }
}