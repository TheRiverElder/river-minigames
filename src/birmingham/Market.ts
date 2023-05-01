import { int } from "../libs/CommonTypes";
import Game from "./Game";
import ResourceType, { RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON } from "./ResourceType";
import { UpdatableUnique } from "./UpdatableUnique";

export default class Market implements UpdatableUnique {
    readonly uid: int;
    readonly game: Game;
    readonly resourceType: ResourceType;
    readonly capacityLevel: int;
    amount: int;

    constructor(game: Game, uid: int, resourceType: ResourceType, capacityLevel: int, amount: int) {
        this.game = game;
        this.uid = uid;
        this.resourceType = resourceType;
        this.capacityLevel = capacityLevel;
        this.amount = amount;

        // this.uid = game.uidGenerator.generate();
        game.listenUpdate(this);
    }

    update(data: any): void {
        this.amount = data.amount;
    }

    getCapacity() {
        return (this.capacityLevel - 1) * 2;
    }

    getNextPrice() {
        return this.capacityLevel - Math.ceil(this.amount / 2);
    }

    getNextPayback() {
        return this.capacityLevel - Math.ceil((this.amount + 1) / 2);
    }

    // 返回所需的金钱
    take(amount: int): int {
        let price = 0;
        for (let i = 0; i < amount; i++) {
            if (this.amount > 0) {
                price += this.getNextPrice();
                this.amount--;
            } else {
                price += this.capacityLevel;
            }
        }
        return price;
    }

    // 返回[没卖出的资源数量, 所得的金钱]
    put(amount: int): [int, int] {
        let payback = 0;
        let rest = amount;
        for (let i = 0; i < amount && this.amount < this.getCapacity(); i++) {
            payback += this.getNextPayback();
            this.amount++;
            rest--;
        }
        return [rest, payback];
    }

}

// export function createCoalMarket(game: Game) {
//     return new Market(game, RESOURCE_TYPE_COAL, 8, 13);
// }

// export function createIronMarket(game: Game) {
//     return new Market(game, RESOURCE_TYPE_IRON, 6, 8);
// }