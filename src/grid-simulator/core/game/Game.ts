import ListenerManager from "../../../libs/management/ListenerManager";
import Registry from "../../../libs/management/Registry";
import GameGrid from "../grid/GameGrid";
import MatterType from "../matter/MatterType";
import ValueType from "../value/ValueType";

export default class Game {

    public readonly registryMatter = new Registry<string, MatterType>(it => it.name);
    public readonly registryValue = new Registry<string, ValueType>(it => it.name);

    public grid: GameGrid;

    constructor(
    ) {
        this.grid = new GameGrid(10, 10); // TODO: Make configurable
    }

    public readonly listeners = Object.freeze({
        tick: new ListenerManager(),
    });

    tick() {
        const cells = this.grid.cells;

        for (const cell of cells) {
            cell.unit?.tick(cell);
        }
        
        for (const cell of cells) {
            for (const valueType of cell.getValueTypes()) {
                valueType.tick(cell);
            }
        }
        
        for (const cell of cells) {
            cell.resumePacks();
        }

        this.listeners.tick.emit();
        
        for (const cell of cells) {
            cell.clearCachedCalculativeValues();
        }
    }

    private pid: NodeJS.Timer | null = null;

    start() {
        if (this.pid !== null) return;
        this.pid = setInterval(this.tick.bind(this), 1000);
    }

    stop() {
        if (this.pid === null) return;
        clearInterval(this.pid);
        this.pid = null;
    }
}