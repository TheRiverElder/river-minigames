import ListenerManager from "../../../libs/management/ListenerManager";
import GameGrid from "../grid/GameGrid";

export default class Game {
    constructor(
        public readonly grid: GameGrid,
    ) {

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