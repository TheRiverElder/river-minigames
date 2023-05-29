import { double } from "../../../libs/CommonTypes";
import { RESOURCE_TYPE_EMPTY } from "../../ResourceTypes";
import ResourceType from "../ResourceType";
import Item from "./Item";
import ItemType from "./ItemType";

export default class ResourceItem extends Item {

    static readonly TYPE = new ItemType("resource", () => new ResourceItem(RESOURCE_TYPE_EMPTY));

    override get type(): ItemType {
        return ResourceItem.TYPE;
    }
    
    readonly mineType: ResourceType;

    constructor(mineType: ResourceType, amount?: double) {
        super(amount);
        this.mineType = mineType;
    }

    override copy(amount?: double): Item {
        return new ResourceItem(this.mineType, amount);
    }
    
}