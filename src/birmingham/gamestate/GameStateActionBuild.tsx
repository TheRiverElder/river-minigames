import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";
import { Location } from "../Types";

export interface GameStateActionBuildState {
    industry: Nullable<string>;
    industrySloyLocation: Nullable<Location>;
}

export default class GameStateActionBuild extends Component<GameStateViewProps, GameStateActionBuildState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industry: null,
            industrySloyLocation: null,
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