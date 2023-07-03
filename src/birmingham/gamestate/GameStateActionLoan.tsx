import { Component, ReactNode } from "react";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionLoanState {
}

export default class GameStateActionLoan extends Component<GameStateViewProps, GameStateActionLoanState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
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
        this.props.rpc.call("performAction", {}).then(() => this.props.refresh());
    }

}