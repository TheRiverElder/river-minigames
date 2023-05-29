import { Productor } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Item from "./Item";

export interface OrbRestoreContext {
    game: Game;
    data: any;
}

export default class ItemType {
    readonly name: string;
    readonly restore: Productor<OrbRestoreContext, Item>;

    constructor(name: string, restore: Productor<any, Item>) {
        this.name = name;
        this.restore = restore;
    }
}