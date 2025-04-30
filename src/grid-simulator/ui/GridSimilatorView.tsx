import React from "react";
import { createTestGame } from "../test/TestGame";
import Cell from "../core/grid/Cell";
import "./GridSimilatorView.scss";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import { Values } from "../core/value/Values";

export default class GridSimilatorView extends React.Component {

    private cleaningFunctions: Array<() => void> = [];
    private game = createTestGame();

    componentDidMount(): void {
        this.cleaningFunctions.push(this.game.listeners.tick.add(() => this.forceUpdate()));
        this.game.start()
    }

    componentWillUnmount(): void {
        this.cleaningFunctions.forEach(cleanupFunction => cleanupFunction());
        this.game.stop();
    }

    override render() {

        const game = this.game;
        const { grid } = game;
        
        const cellSize = 50;

        function createCellView(cell: Cell) {
            return (
                <div
                    key={cell.index}
                    className="cell"
                    style={{
                        left: cell.x * cellSize + 'px',
                        top: cell.y * cellSize + 'px',
                        width: cellSize + 'px',
                        height: cellSize + 'px',
                        backgroundColor: cell.color,
                    }}
                >
                    {cell.unit ? <div className="unit" >{shortenAsHumanReadable(cell.unit.mass)} - {shortenAsHumanReadable(cell.getCalculatedValue(Values.TEMPERATURE))} </div> : null}
                </div>
            );
        }

        return (
            <div className="GridSimilatorView">
                <div
                    className="cells"
                    style={{
                        width: grid.width * cellSize + 'px',
                        height: grid.height * cellSize + 'px',
                    }}
                >
                    {grid.cells.map(createCellView)}
                </div>
            </div>
        );
    }
}