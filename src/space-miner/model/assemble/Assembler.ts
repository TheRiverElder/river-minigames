import { int } from "../../../libs/CommonTypes";
import { mapModel } from "../../../libs/io/Displayable";
import { filterNotNull } from "../../../libs/lang/Collections";
import { CachedItem } from "../../worker/screen/AssemblerServerScreen";
import Game from "../global/Game";
import { ItemModel } from "../item/Item";
import Inventory from "../misc/storage/Inventory";
import Orb from "../orb/Orb";
import Recipe, { AssemblingContext, AssemblingContextModel, RecipeModel } from "./Recipe";


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

    assemble(context: AssemblingContextModel, cachedItems: Array<CachedItem>) {
        const recipe = this.game.recipes.getOrThrow(context.recipe);
        const materials = filterNotNull(context.materials.map(({ cachedItemUid, amount }) => cachedItems.find(it => it.uid === cachedItemUid)?.item.copy(amount) ?? null));
        const inv = new Inventory();
        inv.addAll(materials);
        this.addTask(recipe, { materials: inv });
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

    getRecipeResult(context: AssemblingContextModel, cachedItems: Array<CachedItem>): RecipeModel {
        const recipe = this.game.recipes.getOrThrow(context.recipe);
        const materials = filterNotNull(context.materials.map(({ cachedItemUid, amount }) => cachedItems.find(it => it.uid === cachedItemUid)?.item.copy(amount) ?? null));
        const newContext = {
            materials: new Inventory(),
        };
        newContext.materials.addAll(materials);
        return recipe.getDisplayedModel(newContext);
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
            const result = this.assembler.orb.supplimentNetwork.resources.removeExactAll(this.context.materials.content);
            if (result.length === 0) return;

            // console.log("consumed", result, "prevTotal", prevTotal, "nowTotal", this.assembler.orb.supplimentNetwork.resources.total);
            this.started = true;
        } else {
            // const duration = this.recipe.duration;
            const duration = 200;
            if (this.progressTickCounter >= duration) {
                const result = this.recipe.assemble(this.context);
                this.assembler.orb.supplimentNetwork.resources.addAll(result);
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

export interface AssemblerModel {
    readonly tasks: Array<AssemblerTaskModel>;
}

export interface AssemblerTaskModel {
    readonly progressTickCounter: int;
    readonly totalTickAmount: int;
    readonly products: Array<ItemModel>;
}