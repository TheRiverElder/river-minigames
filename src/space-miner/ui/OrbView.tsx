import React, { Component, CSSProperties, ReactNode } from "react";
import { Consumer, int, Pair, Productor } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import { TWO_PI } from "../../libs/math/Mathmatics";
import PseudoRandom from "../../libs/math/PseudoRandom";
import Random from "../../libs/math/Random";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Miner from "../model/Miner";
import Orb from "../model/Orb";
import { drawOrbBody } from "./OrbGraphics";
import "./OrbView.scss";

export interface OrbViewProps {
    orb: Orb;
    game: Game;
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
                
                <div className="orb-hint">{orb.mines.total.toFixed(1)}</div>

                <div className="miners" >
                    {Array.from(orb.miners.values()).map((miner, i) => (
                        <div 
                            key={i} 
                            className="miner" 
                            style={createMinerStyle([miner, i])}
                            onClick={() => this.onClickMiner(miner)}
                        >
                            <div className="hint">{miner.inventory.total.toFixed(1)}</div>
                            <div className="mark">▼</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    onClickMiner = (miner: Miner) => {
        const game = this.props.game;
        for (const item of miner.inventory.items) {
            const price = game.shop.pricreOf(item);
            const totalPrice = item.amount * price;
            game.profile.account += totalPrice;
        }
        miner.inventory.clear();
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
