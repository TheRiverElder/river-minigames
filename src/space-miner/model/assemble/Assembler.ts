import { int } from "../../../libs/CommonTypes";
import { mapModel } from "../../../libs/io/Displayable";
import { filterNotEmpty } from "../../../libs/lang/Collections";
import Optional from "../../../libs/lang/Optional";
import { CachedItem } from "../../worker/screen/AssemblerServerScreen";
import Game from "../global/Game";
import Item, { ItemModel } from "../item/Item";
import Orb from "../orb/Orb";
import Recipe, { AssemblingContext, AssemblingContextItemModel, createEmptyContext } from "./Recipe";
import FacilityItem from "../item/FacilityItem";
import Facility from "../facility/Facility";


/**
 * TODO 之后要修改供料方式：
 * 先由玩家约定好用来合成的材料，这些材料在供应网中不一定要存在
 * 当合成任务开始时，再从供应网络中抽取对应材料，若材料不足则失败
 * 为了让编写方便，任务取消不会返还物品
 */
export default class Assembler {

    constructor(
        public readonly game: Game,
        public readonly orb: Orb,
    ) { }

    public readonly tasks: Array<AssemblerTask> = [];

    assemble(recipe: Recipe, materials: Array<Item>) {
        const context: AssemblingContext = {
            materials,
        };
        this.addTask(recipe, context);
    }

    autoFill(recipe: Recipe, cachedItems: Array<CachedItem>, previousMaterials: Array<AssemblingContextItemModel> = []): Array<AssemblingContextItemModel> {
        const prevMaterials = filterNotEmpty(previousMaterials.map(mat => cachedItems.find(it => mat.cachedItemUid === it.uid)?.item.copy(mat.amount)));
        const context: AssemblingContext = {
            materials: prevMaterials,
        };
        const materials: Array<AssemblingContextItemModel> = filterNotEmpty(recipe.previewMaterials(context).map((material) =>
            Optional.ofNullable(filterNotEmpty([
                ...previousMaterials.map(mat => cachedItems.find(it => mat.cachedItemUid === it.uid)),
                ...cachedItems,
            ]).find(it => material.item.matches(it.item)) ?? null)
                .map(it => ({
                    cachedItemUid: it.uid,
                    amount: material.item.amount,
                })).orNull()
        ));
        return materials;
    }

    addTask(recipe: Recipe, context: AssemblingContext) {
        if (!recipe.canAssemble(context)) return;
        this.tasks.push(new AssemblerTask(this, recipe, context));
    }

    removeTask(task: AssemblerTask) {
        const index = this.tasks.indexOf(task);
        if (index >= 0) this.tasks.splice(index, 1);
    }

    tick() {
        this.tasks[0]?.tick();
    }

    getDisplayedModel(): AssemblerModel {
        return {
            tasks: this.tasks.map(mapModel),
        };
    }

}

class AssemblerTask {

    public progressTickCounter: int = 0;
    private started: boolean = false;

    constructor(
        public readonly assembler: Assembler,
        public readonly recipe: Recipe,
        public readonly context: AssemblingContext,
    ) { }

    tick() {
        if (!this.started) {
            // const prevTotal = this.assembler.orb.supplimentNetwork.resources.total;
            const result = this.assembler.orb.supplimentNetwork.resources.removeExactAll(this.context.materials);
            if (result.length === 0) return;

            // console.log("consumed", result, "prevTotal", prevTotal, "nowTotal", this.assembler.orb.supplimentNetwork.resources.total);
            this.started = true;
        } else {
            // const duration = this.recipe.duration;
            const duration = 200;
            if (this.progressTickCounter >= duration) {
                const result = this.recipe.assemble(this.context);

                const facilities: Array<Facility> = [];
                const items: Array<Item> = [];

                for (const item of result) {
                    if (item instanceof FacilityItem) {
                        const facility = item.createFacility();
                        facilities.push(facility);
                    } else {
                        items.push(item);
                    }
                }

                this.assembler.orb.supplimentNetwork.resources.addAll(items);
                facilities.forEach((facility) => {
                    this.assembler.orb.addFacility(facility);
                    this.assembler.orb.world.game.listeners.FACILITY_BUILT.emit(facility);
                });

                this.assembler.orb.world.game.listeners.ASSEMBLER_TASK_FINISHED.emit([this.recipe, this.context, result]);

                this.assembler.removeTask(this);
                return;
            }

            // if (this.progressTickCounter < 100)
            this.progressTickCounter++;
        }

    }

    getDisplayedModel(): AssemblerTaskModel {
        return {
            progressTickCounter: this.progressTickCounter,
            totalTickAmount: 200,
            products: this.recipe.previewProducts(this.context).map(mapModel),
        };
    }

}

export type { AssemblerTask };

export interface AssemblerModel {
    readonly tasks: Array<AssemblerTaskModel>;
}

export interface AssemblerTaskModel {
    readonly progressTickCounter: int;
    readonly totalTickAmount: int;
    readonly products: Array<ItemModel>;
}