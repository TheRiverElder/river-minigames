import { int } from "../libs/CommonTypes";
import FactorySlot from "./FactorySlot";
import { UpdatableUnique } from "./UpdatableUnique";

export default class Factory implements UpdatableUnique {
    readonly uid: int;
    readonly belongingSlot: FactorySlot;
    resourceAmount: int;
    sold: boolean;

    constructor(
        uid: int,
        belongingSlot: FactorySlot,
        resourceAmount: int, 
        sold: boolean,
    ) {
        this.uid = uid;
        this.belongingSlot = belongingSlot;
        this.resourceAmount = resourceAmount;
        this.sold = sold;

        const game = belongingSlot.owner.game;
        game.listenUpdate(this);
    }

    update(data: any): void {
        this.resourceAmount = data.resourceAmount;
        this.sold = data.sold;
    }
}