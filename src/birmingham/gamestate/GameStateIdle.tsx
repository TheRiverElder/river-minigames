import { Component, ReactNode } from "react";
import GameStateViewProps from "./GameStateViewProps";

export default class GameStateIdle extends Component<GameStateViewProps> {

    render(): ReactNode {
        return (
            <div>
                <p>当前不可行动</p>
            </div>
        )
    }

}