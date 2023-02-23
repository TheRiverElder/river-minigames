import React from "react";
import { Component, ReactNode } from "react";
import Bion from "../Bion";
import NeublumenBion from "../instances/neublumen/NeublumenBion";

export default class ArtificialLive extends Component {

    private tileSize = 50;
    private bion: Bion = new NeublumenBion(new Uint8Array());

    private canvasRef = React.createRef<HTMLCanvasElement>();

    private pid: NodeJS.Timer | null = null;

    componentDidMount() {
        this.pid = setInterval(() => {
            this.bion.tick();
            const canvas = this.canvasRef.current;
            const g = canvas?.getContext("2d");
            if (g && canvas) {
                g.clearRect(0, 0, canvas.width, canvas.height);
                g.save();
                // g.translate(canvas.width / 2, canvas.height / 2);
                g.scale(this.tileSize, this.tileSize);
                this.bion.render(g);
                g.restore();
            }
        }, 1000);
    }

    componentWillUnmount(): void {
        if (this.pid !== null) {
            clearInterval(this.pid);
            this.pid = null;
        }
    }

    render(): ReactNode {
        return (
            <canvas 
                width={this.bion.board.width * this.tileSize} 
                height={this.bion.board.height * this.tileSize} 
                ref={this.canvasRef}
            />
        )
    }
}