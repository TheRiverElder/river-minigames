import { Component, createRef, CSSProperties, MouseEvent, ReactNode } from "react";
import I18n from "../../libs/i18n/I18n";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Orb from "../model/Orb";
import { initializeTestGame } from "../Test";
import AssemblerView from "./AssemblerView";
import DeploymentView from "./DeploymentView";
import MessageNotifier from "./MessageNotifier";
import OrbInfoView from "./OrbInfoView";
import Overlay from "./Overlay";
import ShopView from "./ShopView";
import SpaceMinerI18nResource from "./SpaceMinerI18nResource";
import "./SpaceMinerUI.scss";
import WarehouseView from "./WarehouseView";
import WorldView from "./WorldView";

export interface SpaceMinerUIProps {
    // game: Game;
}

type OverlayType = "shop" | "warehouse" | "assembler" | "deployment";

const OVERLAY_TYPES: Array<OverlayType> = ["shop", "warehouse", "assembler", "deployment"];

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
    offset: Vector2;
    overlayType: Nullable<OverlayType>;
    detailedOrb: Nullable<Orb>;
}

export default class SpaceMinerUI extends Component<SpaceMinerUIProps, SpaceMinerUIState> {
    
    // get game(): Game { return this.props.game; }
    game: Game = initializeTestGame(); 
    i18n: I18n = new I18n(SpaceMinerI18nResource);

    constructor(props: SpaceMinerUIProps) {
        super(props);
        this.state = {
            orbs: Array.from(this.game.profile.ownedOrbs),
            offset: Vector2.ZERO,
            overlayType: null,
            detailedOrb: null,
        };
    }

    private refSpace = createRef<HTMLDivElement>();

    override render(): ReactNode {

        const game = this.game;
        const i18n = this.i18n;
        const profile = game.profile;
        const overlayType = this.state.overlayType;
        const detailedOrb = this.state.detailedOrb;

        const mapStyle: CSSProperties = {
            ...this.state.offset.toPositionCss(),
        };

        const commonProps = { game, i18n };

        return (
            <div className="SpaceMinerUI">
                <div ref={this.refSpace} className="space" style={mapStyle}>
                    <WorldView world={game.world} {...commonProps} onClickOrb={this.onClickOrb} />
                </div>
                
                <div className="top-bar">
                    <div className="name">Name: {profile.name}</div>
                    <div className="property">Account: {profile.account.toFixed(2)}</div>
                </div>
                
                {detailedOrb && (
                    <div className="orb-info">
                        <OrbInfoView orb={detailedOrb} {...commonProps}/>
                    </div>
                )}

                {overlayType && (<Overlay onBack={() => this.setState({ overlayType: null })}>{this.renderOverlay(overlayType)}</Overlay>)}

                <div className="bottom-bar">
                    {OVERLAY_TYPES.map(t => (
                        <button 
                            key={t} 
                            onClick={() => this.setState(s => ({ overlayType: (s.overlayType === t ? null : t) }))}
                        >{i18n.get("ui.main.button." + t)}</button>
                    ))}
                </div>

                 <MessageNotifier className="messages" i18n={i18n} listeners={game.onMessageListener} />

                 {/* <div style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0", pointerEvents: "none"}} onClick={() => window.alert("test-overlay")}/> */}
            </div>
        );
    }

    // 没办法，兄弟节点中只有一个可以被触发，只能用这种方式触发下层的space层
    // onClickHud = (mouseEvent: MouseEvent) => {
    //     const space = this.refSpace.current;
    //     if (!space) return;
    //     const originEvent = mouseEvent.nativeEvent;
    //     const event = document.createEvent("MouseEvent");
    //     event.initMouseEvent(
    //         "click",
    //         originEvent.bubbles,
    //         originEvent.cancelable,
    //         window,
    //         originEvent.detail,
    //         originEvent.screenX, originEvent.screenY,
    //         originEvent.clientX, originEvent.clientY,
    //         originEvent.ctrlKey,
    //         originEvent.altKey,
    //         originEvent.shiftKey,
    //         originEvent.metaKey,
    //         originEvent.button,
    //         space,
    //     )
    //     // Object.entries(Object.getOwnPropertyDescriptors(event)).forEach(([key, descriptor]) => {
    //     //     console.log(key);
    //     //     if (!descriptor.writable || !descriptor.set) return;
    //     //     (event as any)[key] = (originEvent as any)[key];
    //     // });
    //     space.dispatchEvent(event);
    // };

    onClickOrb = (orb: Orb) => {
        // 由于目前还没考虑做删除星球的逻辑，故先不用考虑吧如果星球被删除后这个细节面板还保留的问题
        this.setState({ detailedOrb: orb });
    };

    renderOverlay(overlayType: OverlayType) {
        const game = this.game;
        const commonProps = { game, i18n: this.i18n };

        switch(overlayType) {
            case "shop": return(<ShopView {...commonProps} shop={game.shop}/>);
            case "warehouse": return(<WarehouseView {...commonProps} profile={game.profile} warehouse={game.profile.warehouse}/>);
            case "assembler": return(<AssemblerView {...commonProps} profile={game.profile} />);
            case "deployment": return(<DeploymentView {...commonProps} />);
        }
    }

    private pid: Nullable<NodeJS.Timeout> = null;
    private mounted: boolean = false;

    override componentDidMount(): void {
        this.mounted = true;
        this.setState({ offset: new Vector2(window.innerWidth / 2, window.innerHeight / 2) });
        const loop = () => {
            if (!this.mounted) return;
            this.game.tick();
            this.pid = setTimeout(loop, 100);
        };
        loop();
    }

    override componentWillUnmount(): void {
        if (this.pid !== null) clearTimeout(this.pid);
        this.mounted = false;
    }
}