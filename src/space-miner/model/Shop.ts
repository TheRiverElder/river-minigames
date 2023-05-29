import { double } from "../../libs/CommonTypes";
import Game from "../Game";
import Item from "./item/Item";
import TestItem from "./item/TestItem";
import Profile from "./Profile";

export default class Shop {

    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    items: Array<Item> = [];

    tick() {
        if (this.game.tickCounter % 1000 === 0) {
            this.items.push(this.createAndAddItem());
            if (this.items.length > 5) {
                this.items.splice(0, this.items.length - 5);
            }
        }
    }

    createAndAddItem(): Item {
        const item = TestItem.TYPE.create(this.game);
        this.items.push(item);
        return item;
    }

    pricreOf(item: Item): double {
        return (item.type.name.length + 0.5) * 15;
    }

    buy(item: Item, profile: Profile): boolean {
        const index = this.items.indexOf(item);
        if (index < 0) return false;
        const price = this.pricreOf(item);
        if (profile.account < price) return false;
        profile.account -= price;
        this.items.splice(index, 1);
        profile.warehouse.add(item);
        return true;
    }
}