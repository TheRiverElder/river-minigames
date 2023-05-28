import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import ItemType from "./ItemType";

export default abstract class Item {
    readonly type: ItemType;
    readonly game: Game;
    amount: double = 1;

    constructor(type: ItemType, game: Game, amount: double = 1) {
        this.type = type;
        this.game = game;
        this.amount = amount;
    }

    abstract onUse(): void;
    
    abstract matches(item: Item): boolean;
    
    abstract copy(amount: double): Item;
    
}