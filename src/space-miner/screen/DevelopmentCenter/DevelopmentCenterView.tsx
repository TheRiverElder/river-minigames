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
    private gridCellSize = new Vector2(300, 100);
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
        const lengthes = new Map<string, int>();

        let progressPerLoop = 0;
        do {
            progressPerLoop = 0;

            for (const tech of technologies) {
                if (lengthes.has(tech.name)) continue;

                if (tech.priors.length === 0) {
                    lengthes.set(tech.name, 0);
                    progressPerLoop++;
                    continue;
                }

                let shouldSetLength = true;
                let maxLength = 0;
                for (const prior of tech.priors) {
                    if (!lengthes.has(prior)) {
                        shouldSetLength = false;
                        break;
                    }
                    const priorLength = lengthes.get(prior);
                    maxLength = Math.max(maxLength, priorLength || 0);
                }

                if (shouldSetLength) {
                    lengthes.set(tech.name, maxLength + 1);
                    progressPerLoop++;
                }
            }

        } while (progressPerLoop > 0);

        for (const [tech, length] of Array.from(lengthes.entries())) {
            let column = columns[length];
            if (!column) {
                column = [];
                columns[length] = column;
            }
            column.push(tech);
        }

        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            const column = columns[columnIndex];
            for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
                const tech = column[rowIndex];
                const position = new Vector2(columnIndex, rowIndex);
                this.positions.set(tech, position);
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

        const cardRect = technologiesView.children[0]?.getBoundingClientRect() || this.gridCellSize;
        const cardSize = new Vector2(cardRect.width, cardRect.height);

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
            const position = this.positions.get(tech.name);
            if (!position) continue;

            for (const prior of tech.priors) {
                const priorPosition = this.positions.get(prior);
                if (!priorPosition) continue;

                g.beginPath();
                g.moveTo(...priorPosition.mul(this.gridCellSize).add(offsetTail).toArray());
                g.lineTo(...position.mul(this.gridCellSize).add(offsetHead).toArray());
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
                        {technologies.map(tech => (
                            <div
                                className="technology"
                                style={{
                                    ...(this.positions.get(tech.name)?.mul(this.gridCellSize).add(this.golbalOffset).toPositionCss() || {})
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
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    override componentDidUpdate(): void {
        this.drawLines();
    }
}