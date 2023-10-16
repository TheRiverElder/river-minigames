import { double } from "../../libs/CommonTypes";
import I18nText from "../../libs/i18n/I18nText";
import { createArray } from "../../libs/lang/Collections";
import { rand, randInt, randOne } from "../../libs/math/Mathmatics";
import Game from "../Game";
import Item from "./item/Item";
import MinerPartItem from "./item/MinerPartItem";
import OrbMiningLicenceItem from "./item/OrbMiningLisenceItem";
import ResourceItem from "./item/ResourceItem";
import { Tags } from "./item/Tags";
import TestItem from "./item/TestItem";
import CargoPart from "./miner/CargoPart";
import CollectorPart from "./miner/CollectorPart";
import FramePart from "./miner/FramePart";
import MainControlPart from "./miner/MainControlPart";
import Profile from "./Profile";
import ResourceType from "./misc/ResourceType";
import { ARTIFICIAL_RESOURCE_TYPES, NATURAL_RESOURCE_TYPES } from "./misc/ResourceTypes";

export default class Shop {

    readonly game: Game;
    readonly basePrices = new Map<ResourceType, double>();

    constructor(game: Game) {
        this.game = game;
    }

    items: Array<Item> = [];

    preTick(game: Game) { }
    postTick(game: Game) { }

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
            ...createArray(randInt(1, 4), () => new MinerPartItem(new CollectorPart(randInt(1, 10), randInt(0, 8000), [Tags.SOLID]))),
            ...createArray(randInt(1, 5), () => new ResourceItem(randOne(NATURAL_RESOURCE_TYPES), randInt(100, 1000))),
            ...createArray(randInt(1, 5), () => new ResourceItem(randOne(ARTIFICIAL_RESOURCE_TYPES), randInt(20, 500))),
        ];

        for (let index = 0; index < this.items.length;) {
            const item = this.items[index];
            if (item.type === OrbMiningLicenceItem.TYPE) {
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
        if (item instanceof ResourceItem) {
            if (this.basePrices.has(item.resourceType)) {
                return this.basePrices.get(item.resourceType)!! * item.amount;
            }
        }
        return (item.type.name.length + 0.5) * 15 * item.amount;
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
            "item": item.displayedName,
            "amount": item.amount,
        }));
        return true;
    }

    sell(item: Item, profile: Profile): boolean {
        const soldItem = profile.warehouse.removeExact(item);
        if (soldItem.amount <= 0) return false;
        
        const price = this.pricreOf(soldItem);
        profile.account += price;
        this.items.push(soldItem);
        
        this.game.displayMessage(new I18nText("game.shop.message.sold_item", {
            "seller": profile.name,
            "item": item.displayedName,
            "amount": item.amount,
        }));
        return true;
    }
}