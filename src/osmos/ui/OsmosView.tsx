import React from "react";
import { Component, ReactNode } from "react";
import Game from "../Game";
import "./OsmosView.scss";

export default class OsmosView extends Component {

    private game = new Game();

    private refCanvas = React.createRef<HTMLCanvasElement>();

    render(): ReactNode {
        return (
            <div className="OsmosView">
                <canvas ref={this.refCanvas}/>
            </div>
        );
    }

    componentDidMount(): void {
        this.game.initialize();
        this.redraw();
    }

    redraw() {
        const canvas = this.refCanvas.current;
        if (!canvas) return;

        // 调整画布尺寸
        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        canvas.width = width;
        canvas.height = height;

        // 获取绘制API
        const g = canvas.getContext("2d");
        if (!g) return;

        // 清空画布
        g.clearRect(0, 0, width, height);

        // 调整坐标系
        g.save();
        g.translate(width / 2, height / 2)

        // 绘制
        for (const body of this.game.bodies.values()) {
            g.save();
            g.translate(...body.position.toArray());
            body.draw(g, this.game);
            g.restore();
        }

        // 恢复坐标系
        g.restore();
    }
}