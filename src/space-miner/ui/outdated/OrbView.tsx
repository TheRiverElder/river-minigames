// import React, { Component, CSSProperties, ReactNode } from "react";
// import { Consumer, int, Pair, Productor } from "../../../libs/CommonTypes";
// import I18nText from "../../../libs/i18n/I18nText";
// import { ifNotNull } from "../../../libs/lang/Objects";
// import Miner from "../../model/miner/Miner";
// import Orb from "../../model/orb/Orb";
// import Profile from "../../model/global/Profile";
// import { drawOrbBody } from "../graphics/OrbGraphics";
// import "./OrbView.scss";
// import { SpaceMinerGameClientCommonProps } from "../common";

// export interface OrbViewProps extends SpaceMinerGameClientCommonProps {
//     orb: Orb;
//     profile?: Profile;
//     doAdjustPosition?: boolean;
//     onClickOrb?: Consumer<Orb>;
// }

// export interface OrbViewState {
    
// }

// export default class OrbView extends Component<OrbViewProps, OrbViewState> {

//     componentDidMount(): void {
//         this.redrawOrbBody();
//     }

//     private canvasOrbBody = React.createRef<HTMLCanvasElement>();

//     render(): ReactNode {
//         return null;
//         // const orb = this.props.orb;
//         // const size = 2 * orb.radius;

//         // const doAdjustPosition = this.props.doAdjustPosition || this.props.doAdjustPosition === undefined;

//         // const orbStyle: CSSProperties = {};

//         // const orbBodyStyle: CSSProperties = {
//         //     width: size + `px`,
//         //     height: size + `px`,
//         //     borderRadius: size + `px`,
//         //     // backgroundColor: int2Color(orb.color),
//         //     // transform: `rotate(${orb.forward}rad)`
//         // }; 

//         // if (doAdjustPosition) {
//         //     Object.assign(orbStyle, orb.position.toPositionCss())
//         // }

//         // const createMinerStyle: Productor<Pair<Miner, int>, CSSProperties> = ([miner, index]) => {
//         //     const angle = (index / orb.facilities.size) * (2 * Math.PI) + orb.rotation;
//         //     const r = orb.radius - (miner.location?.depth || 0);
//         //     return {
//         //         transform: `
//         //             translate(-50%, -50%) 
//         //             rotate(${angle}rad) 
//         //             translateY(${-r}px) 
//         //         `.trim(),
//         //     };
//         // };

//         // const isOwner: boolean = !!this.props.profile && orb.owner === this.props.profile;

//         // return (
//         //     <div 
//         //         className="OrbView" 
//         //         style={orbStyle} 
//         //         onClick={() => ifNotNull<Consumer<Orb>>(this.props.onClickOrb || null, fn => fn(orb))}
//         //     >
//         //         <canvas 
//         //             ref={this.canvasOrbBody}
//         //             className="orb-body" 
//         //             style={orbBodyStyle} 
//         //             width={size}
//         //             height={size}
//         //         />
                
//         //         <div className="orb-hint">{orb.name}</div>

//         //         {isOwner && (
//         //             <div className="miners" >
//         //                 {Array.from(orb.facilities.values()).map((miner, i) => (
//         //                     <div 
//         //                         key={i} 
//         //                         className="miner" 
//         //                         style={createMinerStyle([miner, i])}
//         //                         onClick={() => this.onClickMiner(miner)}
//         //                     >
//         //                         <div className="hint">{miner.cargo.inventory.total.toFixed(1)}</div>
//         //                         <div className="mark">▼</div>
//         //                     </div>
//         //                 ))}
//         //             </div>
//         //         )}
//         //     </div>
//         // );
//     }

//     onClickMiner = (miner: Miner) => {
//         const { gameApi, profile } = this.props;
//         if (!profile) return;
//         const location = miner.location;
//         if (!location) {
//             gameApi.displayMessage(new I18nText(`ui.orb.message.miner_not_deployed`));
//             return;
//         }
//         if (location.depth > 0) {
//             gameApi.displayMessage(new I18nText(`ui.orb.message.miner_not_on_surface`));
//             return;
//         }
//         gameApi.actions.retriveMinerResource(miner, profile)
//         gameApi.actions.refillMinerEnergy(miner);
//     };

//     redrawOrbBody() {
//         const canvas = this.canvasOrbBody.current;
//         if (!canvas) return;

//         const g = canvas.getContext("2d");
//         if (!g) return;

//         drawOrbBody(this.props.orb, g);
//     }
// }
