import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Miner from "../model/Miner";
import Orb from "../model/Orb";

export interface SpaceMinerUIProps {
    // game: Game;
}

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
}

export default class SpaceMinerUI extends Component<SpaceMinerUIProps, SpaceMinerUIState> {
    
    // get game(): Game { return this.props.game; }
    game: Game = initializeGame(); 

    constructor(props: SpaceMinerUIProps) {
        super(props);
        this.state = {
            orbs: this.game.orbs.values(),
        };
    }

    override render(): ReactNode {

        const game = this.game;

        return (
            <div>
                {this.state.orbs.map(orb => (
                    <div>
                        <div>
                            <span>name</span>
                            <span>{orb.name}</span>
                        </div>
                        <div>
                            <span>uid</span>
                            <span>{orb.uid}</span>
                        </div>
                        <div>
                            <h3>miners</h3>
                            <ul>
                                {Array.from(orb.miners).map(miner => (
                                    <li>strength:{miner.strength}, depth:{miner.depth}, total:{miner.inventory.total}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    private update = () => {
        this.setState({ orbs: this.game.orbs.values() });
    }

    private pid: Nullable<NodeJS.Timeout> = null;

    override componentDidMount(): void {
        const loop = () => {
            this.game.tick();
            this.update();
            this.pid = setTimeout(loop, 100);
        };
        loop();
    }

    override componentWillUnmount(): void {
        
    }
}

function initializeGame(): Game {
    const game = new Game();
    const orb = game.createAndAddOrb();
    const miner = new Miner();
    orb.miners.add(miner)
    return game;
}