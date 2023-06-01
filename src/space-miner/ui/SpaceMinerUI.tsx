import { Component, CSSProperties, ReactNode } from "react";
import I18n from "../../libs/i18n/I18n";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Orb from "../model/Orb";
import { initializeTestGame } from "../Test";
import AssemblerView from "./AssemblerView";
import MessageNotifier from "./MessageNotifier";
import OrbView from "./OrbView";
import Overlay from "./Overlay";
import ShopView from "./ShopView";
import SpaceMinerI18nResource from "./SpaceMinerI18nResource";
import "./SpaceMinerUI.scss";
import WarehouseView from "./WarehouseView";

export interface SpaceMinerUIProps {
    // game: Game;
}

type OverlayType = "shop" | "warehouse" | "assembler";

const OVERLAY_TYPES: Array<OverlayType> = ["shop", "warehouse", "assembler"];

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
    offset: Vector2;
    overlayType: Nullable<OverlayType>;
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
        };
    }

    override render(): ReactNode {

        const game = this.game;
        const i18n = this.i18n;
        const profile = game.profile;
        const overlayType = this.state.overlayType;

        const mapStyle: CSSProperties = {
            ...this.state.offset.toPositionCss(),
        };

        const commonProps = { game, i18n };

        return (
            <div className="SpaceMinerUI">
                <div className="map" style={mapStyle}>
                    {this.state.orbs.map(orb => (
                        <OrbView key={orb.uid} orb={orb} {...commonProps} />
                    ))}
                </div>

                {overlayType && (<Overlay onBack={() => this.setState({ overlayType: null })}>{this.renderOverlay(overlayType)}</Overlay>)}

                <div className="top-bar">
                    <div>Name: {profile.name}</div>
                    <div>Account: {profile.account.toFixed(2)}</div>
                </div>

                <div className="bottom-bar">
                    {OVERLAY_TYPES.map(t => (
                        <button 
                            key={t} 
                            onClick={() => this.setState(s => ({ overlayType: (s.overlayType === t ? null : t) }))}
                        >{i18n.get("ui.main.button." + t)}</button>
                    ))}
                </div>

                <MessageNotifier className="messages" i18n={i18n} listeners={game.onMessageListener} />
            </div>
        );
    }

    renderOverlay(overlayType: OverlayType) {
        const game = this.game;
        const commonProps = { game, i18n: this.i18n };

        switch(overlayType) {
            case "shop": return(<ShopView {...commonProps} shop={game.shop}/>);
            case "warehouse": return(<WarehouseView {...commonProps} profile={game.profile} warehouse={game.profile.warehouse}/>);
            case "assembler": return(<AssemblerView {...commonProps} profile={game.profile} />);
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