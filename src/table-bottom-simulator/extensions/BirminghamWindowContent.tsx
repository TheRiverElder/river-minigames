import { ReactNode } from "react";
import Vector2 from "../../libs/math/Vector2";
import { GameWindowContent, GameWindow } from "../TableBottomSimulatorClient";
import { ACTION_TYPES } from "./action/ActionType";
import "./BirminghamWindowContent.scss";

export default class BirminghamWindowContent extends GameWindowContent {

    constructor(window: GameWindow) {
        super(window);
        window.name = "Birmingham"
        window.size = new Vector2(300, 500);
    }

    override render(window: GameWindow): ReactNode {
        return (
            <div className="BirminghamWindowContent">
                {/* 所有玩家信息 */}
                <h3>玩家信息</h3>
                <div className="player-list">
                    {window.simulator.users.values().map(user => (
                        <div className="user">
                            {user.name}
                            
                        </div>
                    ))}
                </div>

                {/* 可执行行动 */}
                <h3>可执行行动</h3>
                <div className="actions">
                    <ul>
                        {ACTION_TYPES.map(type => (
                            <li>{type.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

}