import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import Item from "../item/Item";
import Recipe, { AssemblingContext, Material, materialOf } from "./Recipe";

// const PREVIEW_MINER = new Miner({
//     frame: PREVIEW_PART_FRAME,
//     mainControl: PREVIEW_PART_MAIN_CONTROL,
//     cargo: PREVIEW_PART_CARGO,
//     collector: PREVIEW_PART_COLLECTOR,
//     additions: [],
// });

export interface SimpleRecipeProps {
    readonly game: Game;
    readonly name?: string,
    readonly products?: Array<Item>,
    readonly materials?: Array<Material>,
}

export default class SimpleRecipe extends Recipe {

    override readonly name: string;
    readonly products: Array<Item>;
    readonly materials: Array<Material>;

    override get displayedName(): Text {
        return this.name ? new I18nText(`recipe.${this.name}.name`) : this.products[0].displayedName;
    }

    get materialItems(): Array<Item> {
        return this.materials.map(it => it.item);
    }

    constructor(props: SimpleRecipeProps) {
        super(props.game);
        this.products = props.products?.slice() ?? [];
        this.name = props.name ?? "";
        this.materials = props.materials?.slice() ?? [];
    }

    override previewProducts(context: AssemblingContext): Array<Item> {
        return this.products;
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
        return this.materialItems.every(material => context.materials.content.find(it => material.matches(it) && it.amount >= material.amount));
    }

    override assemble(context: AssemblingContext): Array<Item> {
        const tokenMaterials = context.materials.removeExactAll(this.materialItems);
        if (tokenMaterials.length <= 0) return this.products.map(it => it.copy(0));
        return this.products.map(it => it.copy(it.amount));
    }

    override getHint(context: AssemblingContext): Text {
        const missingMaterials = this.getMissingMaterials(context);
        if (missingMaterials.length === 0) return new I18nText(`recipe.simple.hint.can_assemble`);
        else return new I18nText(`recipe.simple.hint.missing_materials`, {
            "missing_materials": missingMaterials.map(material => material.displayedName),
        });
    }

    getMissingMaterials(context: AssemblingContext) {
        const missingMaterials: Array<Item> = [];
        for (const material of this.materials) {
            const materialItem = material.item;
            const item = context.materials.content.find(it => materialItem.matches(it));
            if (!item) {
                missingMaterials.push(materialItem);
            } else if (item.amount < materialItem.amount) {
                missingMaterials.push(materialItem.copy(materialItem.amount - item.amount));
            }
        }
        return missingMaterials;
    }
}

export function createSimpleRecipe(game: Game, name: string | null, products: Item | Array<Item> = [], consumedMaterials: Array<Item> = [], unconsumedMaterials: Array<Item> = []) {
    return new SimpleRecipe({
        game,
        name: name ?? undefined,
        products: Array.isArray(products) ? products : [products],
        materials: [
            ...unconsumedMaterials.map(it => materialOf(it, false)),
            ...consumedMaterials.map(it => materialOf(it, true)),
        ],
    });
}