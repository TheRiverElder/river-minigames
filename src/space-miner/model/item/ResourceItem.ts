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

    override get name(): string {
        return `资源:${this.resourceType.name}`;
    }
    
    readonly resourceType: ResourceType;

    constructor(mineType: ResourceType, amount?: double) {
        super(amount);
        this.resourceType = mineType;
    }

    override matches(item: Item): boolean {
        return item instanceof ResourceItem && item.resourceType === this.resourceType;
    }

    override doCopy(amount?: double): Item {
        return new ResourceItem(this.resourceType, amount);
    }
    
}