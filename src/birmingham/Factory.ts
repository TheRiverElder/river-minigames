import { int } from "../libs/CommonTypes";
import FactorySlot from "./FactorySlot";
import ResourceType from "./ResourceType";

export default class Factory {
    readonly belongingSlot: FactorySlot;
    readonly resourceType: ResourceType;
    resourceAmount: int;
    sold: boolean;

    constructor(
        belongingSlot: FactorySlot,
        resourceType: ResourceType, 
        resourceAmount: int, 
        sold: boolean,
    ) {
        this.belongingSlot = belongingSlot;
        this.resourceType = resourceType;
        this.resourceAmount = resourceAmount;
        this.sold = sold;
    }

    copy() {
        return new Factory(
            this.belongingSlot,
            this.resourceType, 
            this.resourceAmount, 
            this.sold,
        );
    }
}