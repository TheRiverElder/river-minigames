import Game from "../../Game";
import ItemType from "./ItemType";

export default abstract class Item {
    readonly type: ItemType;
    readonly game: Game;

    constructor(type: ItemType, game: Game) {
        this.type = type;
        this.game = game;
    }

    abstract onUse(): void;
}