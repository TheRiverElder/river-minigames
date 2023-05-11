import React from "react";
import { Component, ReactNode } from "react";
import Bion from "../Bion";
import BionEnvironment from "../BionEnvironment";
import NeublumenBion from "../instances/neublumen/NeublumenBion";
import Part from "../Part";
import ProgramBoardEditor from "./ProgramBoardEditor";

interface ArtificialLiveState {
    part: Part;
    bion: Bion;
    env: BionEnvironment;
}

export default class ArtificialLive extends Component<any, ArtificialLiveState> {

    private tileSize = 50;

    constructor(props: any) {
        super(props);
        const bion = new NeublumenBion(new Uint8Array());
        this.state = {
            part: bion.board.get(3, 3).part!,
            bion,
            env: new BionEnvironment(),
        };
    }

    private canvasRef = React.createRef<HTMLCanvasElement>();

    private pid: NodeJS.Timer | null = null;

    tick = () => {
        this.state.bion.tick(this.state.env);
        const canvas = this.canvasRef.current;
        const g = canvas?.getContext("2d");
        if (g && canvas) {
            g.clearRect(0, 0, canvas.width, canvas.height);
            g.save();
            // g.translate(canvas.width / 2, canvas.height / 2);
            g.scale(this.tileSize, this.tileSize);
            g.strokeStyle = "gray";
            g.lineWidth = 0.05;
            for (let y = 1; y < this.tileSize; y++) {
                g.beginPath();
                g.moveTo(0, y);
                g.lineTo(this.tileSize, y);
                g.stroke();
            }
            for (let x = 1; x < this.tileSize; x++) {
                g.beginPath();
                g.moveTo(x, 0);
                g.lineTo(x, this.tileSize);
                g.stroke();
            }
            this.state.bion.render(g);
            g.restore();
        }
    };

    componentDidMount() {
        this.pid = setInterval(this.tick, 1000);
    }

    componentWillUnmount(): void {
        if (this.pid !== null) {
            clearInterval(this.pid);
            this.pid = null;
        }
    }

    render(): ReactNode {
        return (
            <div>
                <button onClick={this.onDeployClick}>Deploy</button>
                <canvas 
                    width={this.state.bion.board.width * this.tileSize} 
                    height={this.state.bion.board.height * this.tileSize} 
                    ref={this.canvasRef}
                />
                <ProgramBoardEditor program={this.state.bion.program} debugFlag={true} />
            </div>
        )
    }

    onDeployClick = () => {
        // this.state.part.program.refresh();
    }
}