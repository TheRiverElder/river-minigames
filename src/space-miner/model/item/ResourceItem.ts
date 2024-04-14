import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import { CreativeType } from "../io/CreativeType";
import ResourceType from "../misc/ResourceType";
import { ResourceTypes } from "../misc/ResourceTypes";
import Item, { ItemType } from "./Item";

export default class ResourceItem extends Item {

    static readonly TYPE: ItemType =
        new CreativeType("resource", (type, game, data) => new ResourceItem(game, game.world.resourceTypes.getOrThrow(data.resourceType)));

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

    constructor(game: Game, mineType: ResourceType, amount?: double) {
        super(game, amount);
        this.resourceType = mineType;
    }

    override hasTag(tag: string): boolean {
        return this.resourceType.tags.has(tag);
    }

    override onSerialize(context: Game): any {
        return {
            resourceType: this.resourceType.name,
        };
    }

    override matches(item: Item): boolean {
        return item instanceof ResourceItem && item.resourceType === this.resourceType;
    }

    public override getImage(resources: Map<string, string>): string {
        return resources.get(this.resourceType.name) || "";
    }

}