import { int } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Orb from "../orb/Orb";
import Recipe, { AssemblingContext } from "./Recipe";


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

    addTask(recipe: Recipe, context: AssemblingContext) {
        this.tasks.push(new AssemblerTask(this, recipe, context));
    }

    removeTask(task: AssemblerTask) {
        const index = this.tasks.indexOf(task);
        if (index >= 0) this.tasks.splice(index, 1);
    }

    tick() {
        this.tasks[0]?.tick();
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

    

}