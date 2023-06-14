import { profile } from "console";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Item from "../item/Item";
import MinerItem from "../item/MinerItem";
import MinerPartItem from "../item/MinerPartItem";
import CargoPart from "../miner/CargoPart";
import CollectorPart from "../miner/CollectorPart";
import FramePart from "../miner/FramePart";
import MainControlPart from "../miner/MainControlPart";
import Miner from "../miner/Miner";
import MinerPart from "../miner/MinerPart";
import { MINER_PART_TYPE_ADDITION, MINER_PART_TYPE_CARGO, MINER_PART_TYPE_COLLECTOR, MINER_PART_TYPE_FRAME, MINER_PART_TYPE_MAIN_CONTROL } from "../miner/MinerPartTypes";
import { RESOURCE_TYPE_EMPTY } from "../ResourceTypes";
import Recipe, { AssemblingContext } from "./Recipe";

const PREVIEW_PART_FRAME = new FramePart(0, 0, 0);
const PREVIEW_PART_MAIN_CONTROL = new MainControlPart(0);
const PREVIEW_PART_CARGO = new CargoPart(0);
const PREVIEW_PART_COLLECTOR = new CollectorPart(RESOURCE_TYPE_EMPTY, 0);

const PREVIEW_MINER = new Miner({
    frame: PREVIEW_PART_FRAME,
    mainControl: PREVIEW_PART_MAIN_CONTROL,
    cargo: PREVIEW_PART_CARGO,
    collector: PREVIEW_PART_COLLECTOR,
    additions: [],
});

export default class MinerRecipe extends Recipe {

    override get name(): string {
        return "miner";
    }

    override previewProduct(context: AssemblingContext): Item {
        return new MinerItem(PREVIEW_MINER);
    }

    override previewMaterials(context: AssemblingContext): Item[] {
        return [
            new MinerPartItem(PREVIEW_PART_FRAME),
            new MinerPartItem(PREVIEW_PART_MAIN_CONTROL),
            new MinerPartItem(PREVIEW_PART_CARGO),
            new MinerPartItem(PREVIEW_PART_COLLECTOR),
        ];
    }

    override canAccept(item: Item, context: AssemblingContext): boolean {
        if (item.amount < 1 || !(item instanceof MinerPartItem)) return false;
        const missingTypes = this.getMissingPartTypes(context);
        return missingTypes.indexOf(item.part.type) >= 0;
    }

    override accept(item: Item, context: AssemblingContext) {
        context.materials.add(item.take(1));
    }

    override canAssemble(context: AssemblingContext): boolean {
        return context.materials.items.every(item => item.amount >= 1) && this.getMissingPartTypes(context).length === 0;
    }

    override assemble(context: AssemblingContext): Item {
        let frame: Nullable<FramePart> = null;
        let mainControl: Nullable<MainControlPart> = null;
        let cargo: Nullable<CargoPart> = null;
        let collector: Nullable<CollectorPart> = null;
        let additions: Array<MinerPart> = [];

        const appendedItemList = context.materials.items as Array<MinerPartItem>;
        for (let index = 0; index < appendedItemList.length; index++) {
            const item = appendedItemList[index];
            const part = item.part;

            switch (part.type) {
                case MINER_PART_TYPE_FRAME: frame = part as FramePart; break;
                case MINER_PART_TYPE_MAIN_CONTROL: mainControl = part as MainControlPart; break;
                case MINER_PART_TYPE_CARGO: cargo = part as CargoPart; break;
                case MINER_PART_TYPE_COLLECTOR: collector = part as CollectorPart; break;
                case MINER_PART_TYPE_ADDITION: additions.push(part); break;
            };
        }

        if (!frame || !mainControl || !cargo || !collector) throw new Error(`Missing part!`);

        const miner = new Miner({
            frame,
            mainControl,
            cargo,
            collector,
            additions,
        });
        const minerItem = new MinerItem(miner);

        return minerItem;
    }

    override getHint(context: AssemblingContext): Text {
        const missingTypes = this.getMissingPartTypes(context);
        if (missingTypes.length === 0) return new I18nText(`recipe.miner.hint.can_assemble`);
        else return new I18nText(`recipe.miner.hint.missing_part`, {
            "missing_types": missingTypes.map(type => new I18nText(`miner_type.${type.name}`)),
        });
    }

    getMissingPartTypes(context: AssemblingContext) {
        const requiredPartTypes = new Set([
            MINER_PART_TYPE_FRAME,
            MINER_PART_TYPE_MAIN_CONTROL,
            MINER_PART_TYPE_CARGO,
            MINER_PART_TYPE_COLLECTOR,
        ]);
        for (const material of context.materials.items) {
            if (material instanceof MinerPartItem) {
                requiredPartTypes.delete(material.part.type);
            }
        }
        return Array.from(requiredPartTypes);
    }
}