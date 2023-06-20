import { double } from "../../libs/CommonTypes";
import I18nText from "../../libs/i18n/I18nText";
import { createArray } from "../../libs/lang/Collections";
import { rand, randInt, randOne } from "../../libs/math/Mathmatics";
import Game from "../Game";
import Item from "./item/Item";
import MinerPartItem from "./item/MinerPartItem";
import OrbMiningLisenceItem from "./item/OrbMiningLisenceItem";
import TestItem from "./item/TestItem";
import CargoPart from "./miner/CargoPart";
import CollectorPart from "./miner/CollectorPart";
import FramePart from "./miner/FramePart";
import MainControlPart from "./miner/MainControlPart";
import Profile from "./Profile";
import { NATURAL_RESOURCE_TYPES } from "./ResourceTypes";

export default class Shop {

    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    items: Array<Item> = [];

    tick(game: Game) {
        if (this.game.world.tickCounter % 1000 === 0) {
            this.refreshGoods(game);
        }
    }

    refreshGoods(game: Game) {
        const newGoods: Array<Item> = [
            ...createArray(randInt(1, 4), () => {
                const maxEnergy = randInt(2, 8) * 10000;
                return new MinerPartItem(new FramePart(randInt(2, 8) * 100, maxEnergy, maxEnergy));
            }),
            ...createArray(randInt(1, 4), () => new MinerPartItem(new MainControlPart(rand(0.1, 0.3)))),
            ...createArray(randInt(1, 4), () => new MinerPartItem(new CargoPart(randInt(2, 8) * 1000))),
            ...createArray(randInt(1, 4), () => new MinerPartItem(new CollectorPart(randOne(NATURAL_RESOURCE_TYPES), randInt(1, 10)))),
        ];

        for (let index = 0; index < this.items.length;) {
            const item = this.items[index];
            if (item.type === OrbMiningLisenceItem.TYPE) {
                index++;
                continue;
            }
            this.items.splice(index, 1);
        }

        this.items.push(...newGoods);
    }

    createAndAddTestItem(game: Game): Item {
        const item = new TestItem();
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
        this.game.displayMessage(new I18nText("game.shop.message.bought_item", {
            "buyer": profile.name,
            "item": item.name,
            "amount": item.amount,
        }));
        return true;
    }
}