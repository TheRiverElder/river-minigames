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

function drawOrbBody(orb: Orb, g: CanvasRenderingContext2D) {
    const radius = g.canvas.width / 2;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.save();
    g.translate(radius, radius);

    const random = new PseudoRandom(orb.uid);

    g.fillStyle = int2Color(orb.color);
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.clip();
    g.fill();
    
    const drawerIndex = random.nextInt(0, drawers.length); 
    // console.log("drawerIndex", drawerIndex);
    drawers[drawerIndex]({
        orb,
        random,
        graphics: g,
    });

    const lightSize = orb.radius * 1;
    const lightDirection = orb.position.normalized.mul(lightSize);

    const gradientLight = g.createRadialGradient(0, 0, (orb.radius - lightSize), ...lightDirection.toArray(), orb.radius + lightSize);
    gradientLight.addColorStop(0.0, "transparent");
    gradientLight.addColorStop(1.0, "white");
    g.fillStyle = gradientLight;
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.fill();

    const gradientDark = g.createRadialGradient(0, 0, (orb.radius - lightSize), ...lightDirection.mul(-1).toArray(), orb.radius + lightSize);
    gradientDark.addColorStop(0.0, "transparent");
    gradientDark.addColorStop(1.0, "black");
    g.fillStyle = gradientDark;
    g.beginPath();
    g.arc(0, 0, orb.radius, 0, TWO_PI);
    g.fill();

    g.restore();
}

interface DrawerContext {
    orb: Orb;
    random: Random;
    graphics: CanvasRenderingContext2D;
}

const drawers: Array<Consumer<DrawerContext>> = [
    drawSpiral,
    drawStar,
];

function drawSpiral(context: DrawerContext) {
    const { orb, random, graphics } = context;
    const startAngle = random.nextFloat(0, TWO_PI);
    const speed = random.nextFloat(5, 20); // 该螺旋转一周所提升的高度

    // console.log("startAngle", startAngle);
    // console.log("speed", speed);

    // 采用错圆法

    graphics.strokeStyle = "#ffffff80";
    graphics.lineWidth = 3;
    graphics.beginPath();
    for (let layer = 0; layer * speed < orb.radius; layer++) {
        graphics.arc(0, 0, layer * speed, startAngle, startAngle + Math.PI);
        graphics.arc(0.5 * speed, 0, (layer + 0.5) * speed, startAngle + Math.PI, startAngle + TWO_PI);
    }
    graphics.stroke();

    const gradient = graphics.createRadialGradient(0, 0, 0.618 * orb.radius, 0, 0, orb.radius + 1);
    gradient.addColorStop(0.0, "transparent");
    gradient.addColorStop(1.0, "black");
    graphics.fillStyle = gradient;
    graphics.beginPath();
    graphics.arc(0, 0, orb.radius + 1, 0, TWO_PI);
    graphics.fill();
}

function drawStar(context: DrawerContext) {
    const { orb, random, graphics } = context;

    graphics.strokeStyle = "#ffffff80";
    graphics.lineWidth = 3;
    graphics.beginPath();
    const cornerAmount = random.nextInt(4, 10);
    for (let i = 0; i < cornerAmount; i++) {
        const theta = random.nextFloat(0, TWO_PI);
        const rho = random.nextFloat(0.2, 0.9) * orb.radius;
        const offset = Vector2.fromPolar(theta, rho);
        graphics.lineTo(...offset.toArray());
    }
    graphics.closePath();
    graphics.stroke();
    
}

function drawWave(context: DrawerContext) {
    const { random, graphics } = context;
    
}

function drawCrosslink(context: DrawerContext) {
    const { random, graphics } = context;
    
}