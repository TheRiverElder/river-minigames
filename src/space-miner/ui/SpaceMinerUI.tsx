import { Component, CSSProperties, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Miner from "../model/Miner";
import Orb from "../model/Orb";
import { initializeTestGame } from "../Test";
import OrbView from "./OrbView";
import ShopView from "./ShopView";
import "./SpaceMinerUI.scss";

export interface SpaceMinerUIProps {
    // game: Game;
}

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
    offset: Vector2;
}

export default class SpaceMinerUI extends Component<SpaceMinerUIProps, SpaceMinerUIState> {
    
    // get game(): Game { return this.props.game; }
    game: Game = initializeTestGame(); 

    constructor(props: SpaceMinerUIProps) {
        super(props);
        this.state = {
            orbs: Array.from(this.game.profile.orbs),
            offset: Vector2.ZERO,
        };
    }

    override render(): ReactNode {

        const game = this.game;
        const profile = game.profile;

        const mapStyle: CSSProperties = {
            ...this.state.offset.toPositionCss(),
        };

        return (
            <div className="SpaceMinerUI">
                <div className="map" style={mapStyle}>
                    {this.state.orbs.map(orb => (
                        <OrbView key={orb.uid} orb={orb} />
                    ))}
                </div>

                <div className="profile">
                    <div>Name: {profile.name}</div>
                    <div>Account: {profile.account.toFixed(2)}</div>
                </div>

                <div className="overlay">
                    <ShopView game={game} shop={game.shop}/>
                </div>
                
            </div>
        );
    }

    private update = () => {
        this.setState({ orbs: Array.from(this.game.profile.orbs) });
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