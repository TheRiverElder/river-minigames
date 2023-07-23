import { dir } from "console";
import React, { MouseEvent } from "react";
import { Component, ReactNode } from "react";
import { double } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import "./OsmosView.scss";

export interface OsmosViewProps {
    
}

export interface OsmosViewState {
    offset: Vector2;
    scale: double;
}

export default class OsmosView extends Component<OsmosViewProps, OsmosViewState> {

    constructor(props: OsmosViewProps) {
        super(props);
        this.state = {
            offset: Vector2.ZERO,
            scale: 1,
        };
    }

    private game = new Game();

    private refCanvas = React.createRef<HTMLCanvasElement>();

    render(): ReactNode {
        return (
            <div className="OsmosView">
                <canvas 
                    ref={this.refCanvas}
                    onClick={this.onClick}
                />
            </div>
        );
    }

    private pid: Nullable<NodeJS.Timeout> = null;

    componentDidMount(): void {
        this.game.initialize();
        this.redraw();
        const loop = () => {
            this.game.tick();
            this.redraw();
            this.pid = setTimeout(loop, 50);
        };
        loop();
    }

    componentWillUnmount(): void {
        if (this.pid !== null) {
            clearTimeout(this.pid);
        }
    }

    private get offset(): Vector2 {
        return this.state.offset;
    }

    private get scale(): double {
        return this.state.scale;
    }

    mousePositionInWorld(position: Vector2): Vector2 {
        return position.sub(this.offset).div(this.scale);
    }

    onClick = (event: MouseEvent) => {
        const canvas = this.refCanvas.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mousePosition = new Vector2(event.clientX - rect.x, event.clientY - rect.y);
        const worldPosition = this.mousePositionInWorld(mousePosition);

        const direction = worldPosition.sub(this.game.player.position).normalized;
        this.game.player.jet(direction, this.game);
    };

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
        const offset = new Vector2(width / 2, height / 2);
        this.setState({ offset });
        g.translate(...offset.toArray());

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