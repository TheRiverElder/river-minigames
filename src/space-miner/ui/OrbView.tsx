import { Component, CSSProperties, ReactNode } from "react";
import { int, Pair, Productor } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import Miner from "../model/Miner";
import Orb from "../model/Orb";
import "./OrbView.scss";

export interface OrbViewProps {
    orb: Orb;
}

export interface OrbViewState {
    
}

export default class OrbView extends Component<OrbViewProps, OrbViewState> {
    render(): ReactNode {
        const orb = this.props.orb;

        const orbStyle: CSSProperties = {
            ...orb.position.toPositionCss(),
        };

        const orbBodyStyle: CSSProperties = {
            width: orb.radius + `px`,
            height: orb.radius + `px`,
            borderRadius: orb.radius + `px`,
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
                <div className="orb-body" style={orbBodyStyle} />
                
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
}