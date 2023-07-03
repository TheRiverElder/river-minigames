import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionNetworkState {
    linkUid: Nullable<int>,
}

export default class GameStateActionNetwork extends Component<GameStateViewProps, GameStateActionNetworkState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            linkUid: null,
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