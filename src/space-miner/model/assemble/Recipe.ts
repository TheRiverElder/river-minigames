import { double, int } from "../../../libs/CommonTypes";
import Text, { TextModel } from "../../../libs/i18n/Text";
import { mapModel } from "../../../libs/io/Displayable";
import Game from "../global/Game";
import Item, { ItemModel } from "../item/Item";

export interface AssemblingContext {
    readonly materials: Array<Item>;
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

    abstract isUnlocked(): boolean;
 
    // 预览产物
    abstract previewProducts(context: AssemblingContext): Array<Item>;

    // 预览材料，材料可能不固定，所以只是预览其中一种可能性，具体看提示
    abstract previewMaterials(context: AssemblingContext): Array<Material>;

    // 判断这种物品是否可以被作为材料接受
    abstract canAccept(item: Item, context: AssemblingContext): boolean;
    
    // 判断是否可以合成
    abstract canAssemble(context: AssemblingContext): boolean;

    // 开始合成，不做判断
    abstract assemble(context: AssemblingContext): Array<Item>;

    abstract getHint(context: AssemblingContext): Text;

    getDisplayedModel(context: AssemblingContext = createEmptyContext()): RecipeModel {
        return {
            name: this.name,
            displayedName: this.displayedName.getDisplayedModel(),
            previewProducts: this.previewProducts(context).map(mapModel),
            previewMaterials: this.previewMaterials(context).map(it => ({ item: it.item.getDisplayedModel(), consumable: it.consumable })),
            canAssemble: this.canAssemble(context),
            hint: this.getHint(context).getDisplayedModel(),
            unlocked: this.isUnlocked(),
        };
    }
}

export function createEmptyContext(): AssemblingContext {
    return {
        materials: [],
    };
}

export interface AssemblingContextItemModel {
    readonly cachedItemUid: int;
    readonly amount: double;
}

export interface RecipeModel {
    readonly name: string;
    readonly displayedName: TextModel;
    readonly previewProducts: Array<ItemModel>;
    readonly previewMaterials: Array<MaterialModel>;
    readonly canAssemble: boolean;
    readonly hint: TextModel;
    readonly unlocked: boolean;
}

export interface MaterialModel {
    readonly item: ItemModel;
    readonly consumable: boolean;
}