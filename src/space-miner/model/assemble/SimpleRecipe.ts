import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Item from "../item/Item";
import Recipe, { AssemblingContext, Material } from "./Recipe";

// const PREVIEW_MINER = new Miner({
//     frame: PREVIEW_PART_FRAME,
//     mainControl: PREVIEW_PART_MAIN_CONTROL,
//     cargo: PREVIEW_PART_CARGO,
//     collector: PREVIEW_PART_COLLECTOR,
//     additions: [],
// });

export default class SimpleRecipe extends Recipe {

    override readonly name: string;
    readonly product: Item;
    readonly materials: Array<Material>;

    get materialItems(): Array<Item> {
        return this.materials.map(it => it.item);
    }

    constructor(name: string, product: Item, materials: Array<Material>) {
        super();
        this.name = name;
        this.product = product;
        this.materials = materials.slice();
    }

    override previewProduct(context: AssemblingContext): Item {
        return this.product;
    }

    override previewMaterials(context: AssemblingContext): Array<Material> {
        return this.materials;
    }

    override canAccept(item: Item, context: AssemblingContext): boolean {
        return this.materialItems.some(it => it.matches(item));
    }

    override accept(item: Item, context: AssemblingContext) {
        const material = this.materialItems.find(it => it.matches(item));
        if (!material) throw Error(`Cannot accept`);
        context.materials.add(item.take(material.amount));
    }

    override canAssemble(context: AssemblingContext): boolean {
        return this.materialItems.every(material => context.materials.items.find(it => material.matches(it) && it.amount >= material.amount));
    }

    override assemble(context: AssemblingContext): Item {
        return this.product.copy(this.product.amount);
    }

    override getHint(context: AssemblingContext): Text {
        const missingMaterials = this.getMissingMaterials(context);
        if (missingMaterials.length === 0) return new I18nText(`recipe.simple.hint.can_assemble`);
        else return new I18nText(`recipe.simple.hint.missing_materials`, {
            "missing_materials": missingMaterials.map(type => new I18nText(`miner_part.${type.name}.name`)),
        });
    }

    getMissingMaterials(context: AssemblingContext) {
        const missingMaterials: Array<Item> = [];
        for (const material of this.materials) {
            const materialItem = material.item;
            const item = context.materials.items.find(it => materialItem.matches(it));
            if (!item) {
                missingMaterials.push(materialItem);
            } else if (item.amount < materialItem.amount) {
                missingMaterials.push(materialItem.copy(materialItem.amount - item.amount));
            }
        }
        return missingMaterials;
    }
}