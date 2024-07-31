import "./DevelopmentCenterView.scss";
import { Component, createRef, ReactNode } from "react";
import Technology from "../../model/technology/Technology";
import Vector2 from "../../../libs/math/Vector2";
import { int } from "../../../libs/CommonTypes";
import { SpaceMinerGameClientCommonProps } from "../../ui/common";
import { DevelopmentCenterModel, TechnologyByProfileModel } from "./DevelopmentCenterCommon";
import DevelopmentCenterClientScreen from "./DevelopmentCenterClientScreen";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";

export interface DevelopmentCenterViewProps extends SpaceMinerGameClientCommonProps {
    screen: DevelopmentCenterClientScreen;
}

export type DevelopmentCenterViewState = DevelopmentCenterModel;

export default class DevelopmentCenterView extends Component<DevelopmentCenterViewProps> {

    private golbalOffset = new Vector2(20, 20);
    private gridGapSize = new Vector2(100, 50);
    private cardSize = new Vector2(300, 100);
    private positions = new Map<string, Vector2>();

    state: DevelopmentCenterViewState = {
        techPoints: 0,
        technologies: [],
    };


    override componentDidMount(): void {
        this.props.screen.updateUiData();
    }

    private distributePositions() {
        const canvas = this.refCanvas.current;
        if (!canvas) return;
        const technologiesView = this.refTechnologies.current;
        if (!technologiesView) return;

        const technologies = this.state.technologies;

        // 排布科技卡

        const columns: Array<Array<string>> = [];
        const columnIndexes = new Map<string, int>();

        let progressPerLoop = 0;
        do {
            progressPerLoop = 0;

            for (const tech of technologies) {
                const registryName = Technology.getRegistryName(tech.name, tech.level);
                if (columnIndexes.has(registryName)) continue;

                if (tech.priors.length === 0) {
                    columnIndexes.set(registryName, 0);
                    progressPerLoop++;
                    continue;
                }

                let shouldSetLength = true;
                let maxPriorColumnIndex = 0;
                for (const prior of tech.priors) {
                    const priorRegistryName = Technology.getRegistryName(...prior);
                    if (!columnIndexes.has(priorRegistryName)) {
                        shouldSetLength = false;
                        break;
                    }
                    const priorLength = columnIndexes.get(priorRegistryName) ?? 0;
                    maxPriorColumnIndex = Math.max(maxPriorColumnIndex, priorLength);
                }

                if (shouldSetLength) {
                    columnIndexes.set(registryName, maxPriorColumnIndex + 1);
                    progressPerLoop++;
                }
            }

        } while (progressPerLoop > 0);

        for (const [registryName, length] of Array.from(columnIndexes.entries())) {
            let column = columns[length];
            if (!column) {
                column = [];
                columns[length] = column;
            }
            column.push(registryName);
        }

        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            const column = columns[columnIndex];
            for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
                const registryName = column[rowIndex];
                const position = new Vector2(columnIndex, rowIndex);
                this.positions.set(registryName, position);
            }
        }

    }

    private drawLines() {
        const canvas = this.refCanvas.current;
        if (!canvas) return;
        const technologiesView = this.refTechnologies.current;
        if (!technologiesView) return;

        const technologies = this.state.technologies;

        // 绘制连线

        const cardRect = technologiesView.children[0]?.getBoundingClientRect() || this.gridGapSize;
        const cardSize = new Vector2(cardRect.width, cardRect.height);
        this.cardSize = cardSize;
        const gridSize = cardSize.add(this.gridGapSize);

        const offsetHead = new Vector2(0, cardSize.y / 2).add(this.golbalOffset);
        const offsetTail = new Vector2(cardSize.x, cardSize.y / 2).add(this.golbalOffset);

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const g = canvas.getContext("2d");
        if (!g) return;

        g.clearRect(0, 0, canvas.width, canvas.height);

        g.lineWidth = 3;
        g.strokeStyle = "#7f7f7f";


        for (const tech of technologies) {
            const registryName = Technology.getRegistryName(tech.name, tech.level);
            const position = this.positions.get(registryName);
            if (!position) continue;

            for (const prior of tech.priors) {
                const priorRegistryName = Technology.getRegistryName(...prior);
                const priorPosition = this.positions.get(priorRegistryName);
                if (!priorPosition) continue;

                g.beginPath();
                g.moveTo(...priorPosition.mul(gridSize).add(offsetTail).toArray());
                g.lineTo(...position.mul(gridSize).add(offsetHead).toArray());
                g.stroke();
            }
        }
    }

    private refCanvas = createRef<HTMLCanvasElement>();
    private refTechnologies = createRef<HTMLDivElement>();

    override render(): ReactNode {
        const { i18n, screen } = this.props;
        const { techPoints, technologies } = this.state;

        this.distributePositions();
        const gridSize = this.cardSize.add(this.gridGapSize);

        return (
            <div className="DevelopmentCenterView">
                <div className="top-bar">
                    <span>Tech Points: </span>
                    <span>{shortenAsHumanReadable(techPoints)}</span>
                </div>
                <div className="graph">
                    <div className="canvas-wrapper">
                        <canvas ref={this.refCanvas} />
                    </div>
                    <div className="technologies" ref={this.refTechnologies}>
                        {technologies.map(tech => {
                            const registryName = Technology.getRegistryName(tech.name, tech.level);
                            return (
                                <div
                                    key={registryName}
                                    className="technology"
                                    style={{
                                        ...(this.positions.get(registryName)?.mul(gridSize).add(this.golbalOffset).toPositionCss() || {})
                                    }}
                                >
                                    <div className="image-wrapper">

                                    </div>
                                    <div className="detail">
                                        <div className="name">{i18n.get(`technology.${tech.name}.name`)}{tech.level}</div>
                                        <div className="description">{i18n.get(`technology.${tech.name}.description`)}</div>
                                    </div>
                                    <div className="tool-bar">
                                        {!tech.unlocked ? (
                                            <button
                                                disabled={!tech.canUnlock}
                                                onClick={() => { screen.unlock(tech.name, tech.level) }}
                                            >{i18n.get(`ui.development_center.button.unlock`)}</button>
                                        ) : (
                                            <span>{i18n.get(`ui.development_center.text.unlocked`)}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    override componentDidUpdate(): void {
        this.drawLines();
    }
}