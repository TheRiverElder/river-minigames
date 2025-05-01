import React, { CSSProperties } from "react";
import { createTestGame } from "../test/TestGame";
import Cell from "../core/grid/Cell";
import "./GridSimilatorView.scss";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import { Values } from "../core/value/Values";
import ScrollText from "./ScrollText";
import { Pair } from "../../libs/CommonTypes";
import classNames from "classnames";

export interface GridSimilatorViewState {
    observingCellIndex: number;
}

export default class GridSimilatorView extends React.Component<{}, GridSimilatorViewState> {

    state: Readonly<GridSimilatorViewState> = {
        observingCellIndex: -1,
    };

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
        const self = this;

        const game = this.game;
        const { grid } = game;

        const cellSize = 50;

        function createCellView(cell: Cell) {
            const unit = cell.unit;

            let unitView: JSX.Element | null = null;
            if (unit) {
                const massText = shortenAsHumanReadable(unit.mass);
                const temperatureText = shortenAsHumanReadable(cell.getValue(Values.TEMPERATURE));
                const textStyle: CSSProperties = {
                    width: "100%",
                };
                unitView = (
                    <div className="unit">
                        <ScrollText disabled style={textStyle} text={unit.type.name} />
                        <ScrollText disabled style={textStyle} text={massText + ' kg'} />
                        <ScrollText disabled style={textStyle} text={temperatureText + ' K'} />
                    </div>
                );
            }

            return (
                <div
                    key={cell.index}
                    className={classNames("cell", { observing: cell.index === self.state.observingCellIndex })}
                    style={{
                        left: cell.position.x * cellSize + 'px',
                        top: cell.position.y * cellSize + 'px',
                        width: cellSize + 'px',
                        height: cellSize + 'px',
                        backgroundColor: cell.color,
                    }}
                    onClick={() => self.setState({ observingCellIndex: cell.index })}
                >
                    {unitView}
                </div>
            );
        }

        function renderObservingCell(cell: Cell) {
            const unit = cell.unit;

            const pairs: Array<Pair<string, string>> = Object.values(Values).map(key => {
                let value = shortenAsHumanReadable(cell.getValue(key))
                if (key === Values.THERMAL_CONDUCTIVITY) {
                    value = shortenAsHumanReadable(cell.getValue(key), { minimum: 0.001 });
                }
                return [key.name, value];
            });
            if (unit) {
                pairs.push(['Unit', unit.type.name]);
                pairs.push(['Unit Mass', shortenAsHumanReadable(unit.mass)]);
            }

            return (
                <div className="observing-cell">
                    <div>Cell #{cell.index} @({cell.position.x}, {cell.position.y})</div>
                    {pairs.map(([name, value]) => (
                        <div key={name} className="value-row">
                            <span className="name">{name}</span>
                            <span className="value">{value}</span>
                        </div>
                    ))}
                </div>
            );
        }

        const { observingCellIndex } = this.state;
        const observingCell = observingCellIndex < 0 ? null : grid.getCellByIndex(observingCellIndex);

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

                {observingCell && renderObservingCell(observingCell)}
            </div>
        );
    }
}