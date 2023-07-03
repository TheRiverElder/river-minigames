import { Component, ReactNode } from "react";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionDevelopState {
    industries: Array<string>;
}

export default class GameStateActionDevelop extends Component<GameStateViewProps, GameStateActionDevelopState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industries: [],
        };
    }

    render(): ReactNode {
        return (
            <div>
                <div></div>
                <button onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    perform() {
        this.props.rpc.call("performAction", {
            industries: ["", ""],
        }).then(() => this.props.refresh());
    }

}