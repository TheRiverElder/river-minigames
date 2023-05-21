import { Component, CSSProperties, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import Miner from "../model/Miner";
import Orb from "../model/Orb";
import OrbView from "./OrbView";
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
    game: Game = initializeGame(); 

    constructor(props: SpaceMinerUIProps) {
        super(props);
        this.state = {
            orbs: this.game.orbs.values(),
            offset: Vector2.ZERO,
        };
    }

    override render(): ReactNode {

        const game = this.game;

        const mapStyle: CSSProperties = {
            ...this.state.offset.toPositionCss(),
        };

        return (
            <div className="SpaceMinerUI">
                <div className="map" style={mapStyle}>
                    {this.state.orbs.map(orb => (
                        <OrbView orb={orb} />
                    ))}
                </div>
                
            </div>
        );
    }

    private update = () => {
        this.setState({ orbs: this.game.orbs.values() });
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

function initializeGame(): Game {
    const game = new Game();
    for (let i = 0; i < 5; i++) {
        const orb = game.createAndAddOrb();
        const miner = new Miner();
        orb.miners.add(miner)
    };
    return game;
}