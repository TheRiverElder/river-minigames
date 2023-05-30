import { Component, CSSProperties, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Orb from "../model/Orb";
import { initializeTestGame } from "../Test";
import MessageNotifier from "./MessageNotifier";
import OrbView from "./OrbView";
import Overlay from "./Overlay";
import ShopView from "./ShopView";
import "./SpaceMinerUI.scss";
import WarehouseView from "./WarehouseView";

export interface SpaceMinerUIProps {
    // game: Game;
}

type OverlayType = "shop" | "warehouse";

const OVERLAY_TYPES: Array<OverlayType> = ["shop", "warehouse"];

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
    offset: Vector2;
    overlayType: Nullable<OverlayType>;
}

export default class SpaceMinerUI extends Component<SpaceMinerUIProps, SpaceMinerUIState> {
    
    // get game(): Game { return this.props.game; }
    game: Game = initializeTestGame(); 

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
        const profile = game.profile;
        const overlayType = this.state.overlayType;

        const mapStyle: CSSProperties = {
            ...this.state.offset.toPositionCss(),
        };

        return (
            <div className="SpaceMinerUI">
                <div className="map" style={mapStyle}>
                    {this.state.orbs.map(orb => (
                        <OrbView key={orb.uid} orb={orb} game={game} />
                    ))}
                </div>

                {overlayType && (<Overlay onBack={() => this.setState({ overlayType: null })}>{this.renderOverlay(overlayType)}</Overlay>)}

                <div className="top-bar">
                    <div>Name: {profile.name}</div>
                    <div>Account: {profile.account.toFixed(2)}</div>
                </div>

                <div className="bottom-bar">
                    {OVERLAY_TYPES.map(t => (
                        <button onClick={() => this.setState(s => ({ overlayType: (s.overlayType === t ? null : t) }))}>{t.toUpperCase()}</button>
                    ))}
                </div>

                <MessageNotifier className="messages" listeners={game.onMessageListener} />
            </div>
        );
    }

    renderOverlay(overlayType: OverlayType) {
        const game = this.game;

        switch(overlayType) {
            case "shop": return(<ShopView game={game} shop={game.shop}/>);
            case "warehouse": return(<WarehouseView game={game} profile={game.profile} warehouse={game.profile.warehouse}/>);
        }
    }

    private update = () => {
        this.setState({ orbs: Array.from(this.game.profile.ownedOrbs) });
    }

    private pid: Nullable<NodeJS.Timeout> = null;
    private mounted: boolean = false;

    override componentDidMount(): void {
        this.mounted = true;
        this.setState({ offset: new Vector2(window.innerWidth / 2, window.innerHeight / 2) });
        const loop = () => {
            if (!this.mounted) return;
            this.game.tick();
            this.update();
            this.pid = setTimeout(loop, 100);
        };
        loop();
    }

    override componentWillUnmount(): void {
        if (this.pid !== null) clearTimeout(this.pid);
        this.mounted = false;
    }
}