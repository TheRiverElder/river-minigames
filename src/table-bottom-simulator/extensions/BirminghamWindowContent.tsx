import { ReactNode } from "react";
import Vector2 from "../../libs/math/Vector2";
import { GameWindowContent, GameWindow } from "../TableBottomSimulatorClient";

export default class BirminghamWindowContent extends GameWindowContent {

    constructor(window: GameWindow) {
        super(window);
        window.size = new Vector2(500, 800);
    }

    override render(window: GameWindow): ReactNode {
        return (
            <div>
                {/* 所有玩家信息 */}
                <div>
                    {window.simulator.users.values().map(user => (
                        <div className="user">
                            {user.name}
                            
                        </div>
                    ))}
                </div>

                {/* 可执行行动 */}
                <div>
                    <div>可执行行动：</div>
                </div>
            </div>
        );
    }

}