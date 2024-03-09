import { int } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Orb from "../orb/Orb";
import Recipe, { AssemblingContext } from "./Recipe";


export default class Assembler {

    constructor(
        public readonly game: Game,
        public readonly orb: Orb,
    ) { }

    public readonly tasks: Array<AssemblerTask> = [];

    addTask(recipe: Recipe, context: AssemblingContext) {
        // TODO 此处还要判断是否成功
        this.orb.supplimentNetwork.resources.removeExactAll(context.materials.content);

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

    constructor(
        public readonly assembler: Assembler,
        public readonly recipe: Recipe,
        public readonly context: AssemblingContext,
    ) { }

    tick() {
        // const duration = this.recipe.duration;
        const duration = 200;
        if (this.progressTickCounter >= duration) {
            const result = this.recipe.assemble(this.context);
            this.assembler.orb.supplimentNetwork.resources.addAll(result);
            this.assembler.removeTask(this);

            return;
        }

        this.progressTickCounter++;
    }

}