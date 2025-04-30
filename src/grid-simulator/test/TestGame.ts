import { randOneOrNull } from "../../libs/math/Mathmatics";
import Game from "../core/game/Game";
import GameGrid from "../core/grid/GameGrid";
import Unit from "../core/unit/Unit";
import { Values } from "../core/value/Values";

export function createTestGame() {
    const grid = new GameGrid(10, 10);
    // Add test logic here

    const cells = grid.cells;
    for (let i = 0; i < 10; i++) {
        const cell = randOneOrNull(cells);
        if (!cell) continue;

        cell.unit = new Unit(10);
        cell.changeActualValue(Values.HEAT, 30000 + i * 10);
    }

    const game = new Game(grid);

    return game;
}