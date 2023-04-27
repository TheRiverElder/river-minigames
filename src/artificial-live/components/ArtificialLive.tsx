import React from "react";
import { Component, ReactNode } from "react";
import Vector2 from "../../libs/math/Vector2";
import Bion from "../Bion";
import NeublumenBion from "../instances/neublumen/NeublumenBion";
import NeublumenBranch from "../instances/neublumen/NeublumenBranch";
import Part from "../Part";
import ProgramBoardEditor from "./ProgramBoardEditor";

interface ArtificialLiveState {
    part: Part;
    bion: Bion;
}

export default class ArtificialLive extends Component<any, ArtificialLiveState> {

    private tileSize = 50;

    constructor(props: any) {
        super(props);
        const bion = new NeublumenBion(new Uint8Array());
        const part = new NeublumenBranch(bion, new Vector2(0, 0));
        bion.board.set(...part.position.toArray(), part)
        this.state = {
            part,
            bion,
        };
    }

    private canvasRef = React.createRef<HTMLCanvasElement>();

    private pid: NodeJS.Timer | null = null;

    componentDidMount() {
        this.pid = setInterval(() => {
            this.state.bion.tick();
            const canvas = this.canvasRef.current;
            const g = canvas?.getContext("2d");
            if (g && canvas) {
                g.clearRect(0, 0, canvas.width, canvas.height);
                g.save();
                // g.translate(canvas.width / 2, canvas.height / 2);
                g.scale(this.tileSize, this.tileSize);
                this.state.bion.render(g);
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
            <div>
                <button onClick={this.onDeployClick}>Deploy</button>
                <canvas 
                    width={this.state.bion.board.width * this.tileSize} 
                    height={this.state.bion.board.height * this.tileSize} 
                    ref={this.canvasRef}
                />
                <ProgramBoardEditor program={this.state.part.program} debugFlag={true} />
            </div>
        )
    }

    onDeployClick = () => {
        // this.state.part.program.refresh();
    }
}