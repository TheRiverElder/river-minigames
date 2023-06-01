import React, { Component, CSSProperties, ReactNode } from "react";
import { int, Pair, Productor } from "../../libs/CommonTypes";
import Miner from "../model/miner/Miner";
import Orb from "../model/Orb";
import { drawOrbBody } from "./OrbGraphics";
import "./OrbView.scss";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface OrbViewProps extends SpaceMinerUICommonProps {
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
            // backgroundColor: int2Color(orb.color),
            transform: `rotate(${orb.forward}rad)`
        }; 

        const createMinerStyle: Productor<Pair<Miner, int>, CSSProperties> = ([miner, index]) => {
            const angle = (index / orb.miners.size) * (2 * Math.PI) + orb.forward;
            const r = orb.radius - (miner.location?.depth || 0);
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
                
                <div className="orb-hint">{orb.mines.total.toFixed(1)}</div>

                <div className="miners" >
                    {Array.from(orb.miners.values()).map((miner, i) => (
                        <div 
                            key={i} 
                            className="miner" 
                            style={createMinerStyle([miner, i])}
                            onClick={() => this.onClickMiner(miner)}
                        >
                            <div className="hint">{miner.cargo.inventory.total.toFixed(1)}</div>
                            <div className="mark">▼</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    onClickMiner = (miner: Miner) => {
        const game = this.props.game;
        for (const item of miner.cargo.inventory.items) {
            const price = game.shop.pricreOf(item);
            const totalPrice = item.amount * price;
            game.profile.account += totalPrice;
        }
        miner.cargo.inventory.clear();
        game.refillMinerEnergy(miner);
    };

    redrawOrbBody() {
        const canvas = this.canvasOrbBody.current;
        if (!canvas) return;

        const g = canvas.getContext("2d");
        if (!g) return;

        drawOrbBody(this.props.orb, g);
    }
}
