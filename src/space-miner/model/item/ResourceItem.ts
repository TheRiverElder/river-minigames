import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import ResourceType from "../ResourceType";
import { ResourceTypes } from "../ResourceTypes";
import Item from "./Item";
import ItemType from "./ItemType";

export default class ResourceItem extends Item {

    static readonly TYPE = new ItemType("resource", () => new ResourceItem(ResourceTypes.EMPTY));

    override get type(): ItemType {
        return ResourceItem.TYPE;
    }
    
    override get name(): string {
        return this.resourceType.name;
    }

    override get displayedName(): Text {
        return new I18nText(`resource_type.${this.resourceType.name}`);
    }

    override get description(): Text {
        return new I18nText(`resource_type.${this.resourceType.name}`);
    }
    
    readonly resourceType: ResourceType;

    constructor(mineType: ResourceType, amount?: double) {
        super(amount);
        this.resourceType = mineType;
    }

    override hasTag(tag: string): boolean {
        return this.resourceType.tags.has(tag);
    }

    override matches(item: Item): boolean {
        return item instanceof ResourceItem && item.resourceType === this.resourceType;
    }

    override doCopy(amount?: double): Item {
        return new ResourceItem(this.resourceType, amount);
    }

    public override getImage(resources: Map<string, string>): string {
        return resources.get(this.resourceType.name) || "";
    }
    
}