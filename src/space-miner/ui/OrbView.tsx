import React, { Component, CSSProperties, ReactNode } from "react";
import { int, Pair, Productor } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Miner from "../model/Miner";
import Orb from "../model/Orb";
import "./OrbView.scss";

export interface OrbViewProps {
    orb: Orb;
}

export interface OrbViewState {
    
}

export default class OrbView extends Component<OrbViewProps, OrbViewState> {

    componentDidMount(): void {
        this.redrawOrbBody();
    }

    private canvasOrbBody = React.createRef<HTMLCanvasElement>();

    render(): ReactNode {
        const orb = this.props.orb;
        const size = 2 * orb.radius;

        const orbStyle: CSSProperties = {
            ...orb.position.toPositionCss(),
        };

        const orbBodyStyle: CSSProperties = {
            width: size + `px`,
            height: size + `px`,
            borderRadius: size + `px`,
            backgroundColor: int2Color(orb.color),
            transform: `rotate(${orb.forward}rad)`
        }; 

        const createMinerStyle: Productor<Pair<Miner, int>, CSSProperties> = ([miner, index]) => {
            const angle = (index / orb.miners.size) * (2 * Math.PI) + orb.forward;
            const r = orb.radius - miner.depth;
            return {
                transform: `
                    translate(-50%, -50%) 
                    rotate(${angle}rad) 
                    translateY(${-r}px) 
                `.trim(),
            };
        };

        return (
            <div className="OrbView" style={orbStyle}>
                <canvas 
                    ref={this.canvasOrbBody}
                    className="orb-body" 
                    style={orbBodyStyle} 
                    width={size}
                    height={size}
                />
                
                <div className="orb-hint">{orb.mines.total}</div>

                <div className="miners" >
                    {Array.from(orb.miners.values()).map((miner, i) => (
                        <div key={i} className="miner" style={createMinerStyle([miner, i])}>
                            <div className="hint">{miner.inventory.total.toFixed(1)}</div>
                            <div className="mark">▼</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    redrawOrbBody() {
        const canvas = this.canvasOrbBody.current;
        if (!canvas) return;

        const g = canvas.getContext("2d");
        if (!g) return;

        drawOrbBody(this.props.orb, g);
    }
}

function drawOrbBody(orb: Orb, g: CanvasRenderingContext2D) {
    const radius = g.canvas.width / 2;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(radius, radius);

    const random = new PseudoRandom(orb.uid);
    

    g.restore();
}