import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import Item from "../item/Item";
import Storage from "../misc/storage/Storage";

export interface AssemblingContext {
    readonly materials: Storage;
}

export interface Material {
    readonly item: Item;
    readonly consumable: boolean;
}

export function materialOf(item: Item, consumable: boolean = true): Material {
    return { item, consumable };
}

export default abstract class Recipe {

    constructor(public readonly game: Game) {}

    abstract get name(): string;

    abstract get displayedName(): Text;
 
    // 预览产物
    abstract previewProducts(context: AssemblingContext): Array<Item>;

    // 预览材料，材料可能不固定，所以只是预览其中一种可能性，具体看提示
    abstract previewMaterials(context: AssemblingContext): Array<Material>;

    // 判断这种物品是否可以被作为材料接受
    abstract canAccept(item: Item, context: AssemblingContext): boolean;

    // 将这种物品作为材料加入Context
    abstract accept(item: Item, context: AssemblingContext): void;
    
    // 判断是否可以合成
    abstract canAssemble(context: AssemblingContext): boolean;

    // 开始合成，不做判断
    abstract assemble(context: AssemblingContext): Array<Item>;

    abstract getHint(context: AssemblingContext): Text;
}