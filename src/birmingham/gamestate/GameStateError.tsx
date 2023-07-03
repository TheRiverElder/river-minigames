import { Component, ReactNode } from "react";
import GameStateViewProps from "./GameStateViewProps";

export default class GameStateError extends Component<GameStateViewProps> {
    render(): ReactNode {
        return (
            <div>
                <h2>错误：</h2>
                <p>{this.props.data?.errorMessage}</p>
                <p>{JSON.stringify(this.props.data)}</p>
            </div>
        )
    }

}