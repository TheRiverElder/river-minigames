import { int } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Item from "../item/Item";
import Inventory from "../misc/storage/Inventory";
import SimpleStorage from "../misc/storage/SimpleStorage";
import Storage from "../misc/storage/Storage";
import Orb from "../orb/Orb";
import Recipe from "./Recipe";


export default class Assembler {

    constructor(
        public readonly game: Game,
        public readonly orb: Orb,
    ) { }

    public readonly tasks: Array<AssemblerTask> = [];

    addTask(recipe: Recipe, materials: Array<Item>) {
        // TODO 此处还要判断是否成功
        this.orb.supplimentNetwork.resources.removeExactAll(materials);

        const m = new Inventory();
        m.addAll(materials);

        this.tasks.push(new AssemblerTask(
            this,
            recipe,
            m,
        ));
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
        public readonly materials: Storage,
    ) { }

    tick() {
        // const duration = this.recipe.duration;
        const duration = 200;
        if (this.progressTickCounter >= duration) {
            const result = this.recipe.assemble({
                game: this.assembler.game,
                materials: this.materials,
            });
            this.assembler.orb.supplimentNetwork.resources.add(result);
            this.assembler.removeTask(this);

            return;
        }

        this.progressTickCounter++;
    }

}