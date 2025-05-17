import { randOneOrNull } from "../../libs/math/Mathmatics";
import Game from "../core/game/Game";
import GameGrid from "../core/grid/GameGrid";
import { Matters } from "../core/matter/Matters";
import { Units } from "../core/unit/Units";
import { Values } from "../core/value/Values";

export function createTestGame() {

    const game = new Game();

    game.registryMatter.addAll(Object.values(Matters));
    game.registryValue.addAll(Object.values(Values));
    
    const grid = new GameGrid(10, 10);

    const cells = grid.cells;
    for (let i = 0; i < 10; i++) {
        const cell = randOneOrNull(cells);
        if (!cell) continue;

        cell.unit = Units.COAL.create();
        // cell.changeActualValue(Values.HEAT, 30000 + i * 10);
    }

    game.grid = grid;

    return game;
}
