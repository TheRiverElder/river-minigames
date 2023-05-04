import { Consumer } from "react";
import { Nullable } from "../../libs/lang/Optional";

export default abstract class Channal {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    private sender: Nullable<Consumer<any>> = null;

    bindSender(sender: Consumer<any>) {
        this.sender = sender;
    }

    get valid(): boolean {
        return !!this.sender;
    }

    send(data: any) {
        if (this.sender) {
            this.sender(data);
        } else throw Error(`Not valid channel: ${this.name}`);
    }

    abstract clientReceive(data: any): void;
    abstract serverReceive(data: any): void;
}