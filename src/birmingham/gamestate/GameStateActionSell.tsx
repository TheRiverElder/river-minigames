import { Component, ReactNode } from "react";
import { Location } from "../Types";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionSellState {
    orders: Array<[Location, Location]>;
}

export default class GameStateActionSell extends Component<GameStateViewProps, GameStateActionSellState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            orders: [],
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