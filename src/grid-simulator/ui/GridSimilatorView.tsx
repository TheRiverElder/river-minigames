import React from "react";
import { createTestGame } from "../test/TestGame";
import Cell from "../core/Cell";
import "./GridSimilatorView.scss";

export default class GridSimilatorView extends React.Component {

    private grid = createTestGame();

    override render() {

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
                    }}
                >
                    {cell.unit ? <div className="unit" /> : null}
                </div>
            );
        }

        return (
            <div className="GridSimilatorView">
                <div
                    className="cells"
                    style={{
                        width: this.grid.width * cellSize + 'px',
                        height: this.grid.height * cellSize + 'px',
                    }}
                >
                    {this.grid.cells.map(createCellView)}
                </div>
            </div>
        );
    }
}