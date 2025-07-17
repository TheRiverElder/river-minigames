import React, { CSSProperties } from "react";
import { createTestGame } from "../test/TestGame";
import Cell from "../core/grid/Cell";
import "./GridSimilatorView.scss";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import { Values } from "../core/value/Values";
import ScrollText from "./ScrollText";
import { Pair } from "../../libs/CommonTypes";
import classNames from "classnames";
import HeatMapRenderer from "./HeatMapRenderer";
import ValueType from "../core/value/ValueType";
import { capitalize } from "lodash";
import { createTestGameClient } from "../test/TestGameClient";
import { createAtanNormalizer } from "./NormlizeFunctions";
import PackPathRenderer, { PackPathRenderedDataItem } from "./PackPathRenderer";
import { rgbFromInt } from "../../libs/math/Colors";

export interface GridSimilatorViewState {
    observingCellIndex: number;
    heatMapValueType: ValueType | null;
    showCells: boolean;
}

const HEAT_MAP_CELL_SIZE = 100;
const VALUE_TYPE_LIST = Object.values(Values);

export default class GridSimilatorView extends React.Component<{}, GridSimilatorViewState> {

    state: Readonly<GridSimilatorViewState> = {
        observingCellIndex: -1,
        heatMapValueType: Values.TEMPERATURE,
        showCells: true,
    };

    private cleaningFunctions: Array<() => void> = [];
    private game = createTestGame();
    private client = createTestGameClient();

    componentDidMount(): void {
        this.cleaningFunctions.push(this.game.listeners.tick.add(() => {
            this.forceUpdate();
            this.drawHeatMap();
        }));
        this.game.start();
        this.drawHeatMap();
    }

    componentWillUnmount(): void {
        this.cleaningFunctions.forEach(cleanupFunction => cleanupFunction());
        this.game.stop();
    }

    private canvasRef = React.createRef<HTMLCanvasElement>();
    private heatMapRenderer = new HeatMapRenderer({
        defaultNormalizeFunction: createAtanNormalizer(100),
        scalar: HEAT_MAP_CELL_SIZE,
        client: this.client,
    });
    private packPathRenderer = new PackPathRenderer({
        scalar: HEAT_MAP_CELL_SIZE,
        length: 0.2,
        client: this.client,
        defaultColor: rgbFromInt(0xffffff),
        maxLineWidth: 0.1,
        defaultNormalizeFunction: createAtanNormalizer(5),
    });

    public drawHeatMap() {
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        const { heatMapValueType } = this.state;
        this.heatMapRenderer.render(canvas, {
            type: heatMapValueType ?? undefined,
            data: this.game.grid.cells.map(cell => [cell.position, heatMapValueType ? cell.getValue(heatMapValueType) : 0]),
        });
        this.packPathRenderer.render(canvas, {
            data: this.game.grid.cells.reduce((array: Array<PackPathRenderedDataItem>, cell) => {
                cell.recentPacks
                    .filter(it => it.valueType === heatMapValueType)
                    .forEach(pack => array.push({
                        position: cell.position,
                        direction: pack.direction,
                        type: pack.valueType,
                        value: pack.value,
                    }));
                return array;
            }, []),
        });
    }

    override render() {
        const self = this;

        const game = this.game;
        const { grid } = game;

        const cellSize = HEAT_MAP_CELL_SIZE;
        const { heatMapValueType, observingCellIndex, showCells } = this.state;

        const valueDisplayConfig = heatMapValueType ? this.client.registryValueDisplayConfig.get(heatMapValueType).orNull() : undefined;

        function createCellView(cell: Cell) {
            const unit = cell.unit;

            const textStyle: CSSProperties = {
                width: "100%",
            };

            const massText = unit ? shortenAsHumanReadable(unit.mass) : cell.mass;
            let heatMapValueText = "";
            if (heatMapValueType) {
                const numberText = shortenAsHumanReadable(cell.getValue(heatMapValueType), valueDisplayConfig?.readableNumberOptions);
                heatMapValueText = `${numberText} ${valueDisplayConfig?.defaultUnit}`;
            }

            // let unitView: JSX.Element | null = null;
            // if (unit) {
            //     const massText = shortenAsHumanReadable(unit.mass);
            //     unitView = (
            //         <div className="unit">
            //             <ScrollText disabled style={textStyle} text={unit.type.name} />
            //             <ScrollText disabled style={textStyle} text={massText + ' kg'} />
            //         </div>
            //     );
            // }

            return (
                <div
                    key={cell.index}
                    className={classNames("cell", { observing: cell.index === self.state.observingCellIndex })}
                    style={{
                        left: cell.position.x * cellSize + 'px',
                        top: cell.position.y * cellSize + 'px',
                        width: cellSize + 'px',
                        height: cellSize + 'px',
                        // backgroundColor: cell.color,
                    }}
                    onClick={() => self.setState({ observingCellIndex: cell.index })}
                >
                    {/* {unitView} */}

                    <ScrollText disabled style={textStyle} text={unit?.type.name ?? ""} />
                    <ScrollText disabled style={textStyle} text={massText + ' kg'} />
                    <ScrollText disabled style={textStyle} text={heatMapValueText} />
                    {unit && (
                        <img src={`./assets/grid-simulator/${unit.type.name}.png`} />
                    )}
                </div>
            );
        }
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
                    <canvas ref={this.canvasRef} />
                    {showCells && grid.cells.map(createCellView)}
                </div>

                <div className="control-panel">
                    <div className="value-panel">
                        <label>
                            Show Cells:
                            <input type="checkbox" checked={showCells} onChange={e => this.setState({ showCells: e.target.checked })} />
                        </label>
                        {/* 设置heatMapValueType字段 */}
                        <label>
                            Heat Map Value Type:
                            <select
                                value={this.state.heatMapValueType?.name ?? ''}
                                onChange={(e) => this.setState({ heatMapValueType: VALUE_TYPE_LIST.find(t => t.name === e.target.value) ?? null })}
                            >
                                {VALUE_TYPE_LIST.map(t => (
                                    <option key={t.name} value={t.name}>{capitalize(t.name.split('_').join(' '))}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {observingCell && this.renderObservingCell(observingCell)}
                </div>
            </div>
        );
    }


    private renderObservingCell(cell: Cell) {
        const unit = cell.unit;

        const pairs: Array<Pair<string, string>> = Object.values(Values).map(key => {
            const value = cell.getValue(key);
            const config = this.client.registryValueDisplayConfig.get(key).orNull();
            const numberText = shortenAsHumanReadable(value, config?.readableNumberOptions);
            const valueText = `${numberText} ${config?.defaultUnit}`;
            return [key.name, valueText];
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

}