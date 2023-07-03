import { Component, ReactNode } from "react";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionScoutState {
    extraCards: Array<string>;
}

export default class GameStateActionScout extends Component<GameStateViewProps, GameStateActionScoutState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            extraCards: [],
        };
    }
    
    render(): ReactNode {
        return (
            <div>
                <button onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    perform() {
        this.props.rpc.call("performAction", {
            extraCards: ["", ""],
        }).then(() => this.props.refresh());
    }

}