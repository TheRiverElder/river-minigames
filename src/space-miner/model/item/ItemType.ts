import { Supplier } from "../../../libs/CommonTypes";
import Item from "./Item";

export default class ItemType {
    readonly name: string;
    readonly create: Supplier<Item>;

    constructor(name: string, create: Supplier<Item>) {
        this.name = name;
        this.create = create;
    }
}