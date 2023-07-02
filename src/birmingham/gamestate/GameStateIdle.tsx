import { ReactNode } from "react";
import { GameStateRenderContext } from "../GameState";
import GameState from "../GameState";
import Profile from "../Profile";

export default class GameStateIdle implements GameState {
    render(context: GameStateRenderContext): ReactNode {
        return (
            <div>
                <p>当前不可行动</p>
            </div>
        )
    }

}