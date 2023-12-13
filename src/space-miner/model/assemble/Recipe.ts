import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Item from "../item/Item";
import Inventory from "../misc/storage/Inventory";

export interface AssemblingContext {
    readonly game: Game;
    readonly materials: Inventory;
}

export interface Material {
    item: Item;
    consumable: boolean;
}

export function materialOf(item: Item, consumable: boolean = true): Material {
    return { item, consumable };
}

export default abstract class Recipe {

    abstract get name(): string;

    abstract get displayedName(): Text;

    abstract previewProduct(context: AssemblingContext): Item;

    abstract previewMaterials(context: AssemblingContext): Array<Material>;

    abstract canAccept(item: Item, context: AssemblingContext): boolean;

    abstract accept(item: Item, context: AssemblingContext): void;
    
    abstract canAssemble(context: AssemblingContext): boolean;

    abstract assemble(context: AssemblingContext): Item;

    abstract getHint(context: AssemblingContext): Text;
}