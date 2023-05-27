import { Productor } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Item from "./Item";

export default class ItemType {
    readonly name: string;
    readonly creator: Productor<[ItemType, Game], Item>;

    constructor(name: string, creator: Productor<[ItemType, Game], Item>) {
        this.name = name;
        this.creator = creator;
    }

    create(game: Game) {
        return this.creator([this, game]);
    }
}