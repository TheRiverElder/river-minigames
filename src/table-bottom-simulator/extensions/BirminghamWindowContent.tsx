import { ReactNode } from "react";
import Vector2 from "../../libs/math/Vector2";
import { GameWindowContent, GameWindow } from "../TableBottomSimulatorClient";
import { ACTION_TYPES } from "./action/ActionType";
import "./BirminghamWindowContent.scss";
import BirminghamInstructionChannel, { ActionOptionsData } from "./channels/BirminghamInstructionChannel";

export interface BirminghamWindowContentProps {
    window: GameWindow;
}

export interface BirminghamWindowContentState {
    options: ActionOptionsData | null;
}

export default class BirminghamWindowContent extends GameWindowContent<BirminghamWindowContentProps, BirminghamWindowContentState> {

    constructor(props: BirminghamWindowContentProps) {
        super(props);
        const window = props.window;
        window.name = "Birmingham";
        window.size = new Vector2(300, 500);
        this.state = {
            options: null,
        };
    }

    override render(): ReactNode {
        const window = this.props.window;
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
                {(!this.state.options) ? (
                    <h3>不可执行行动</h3>
                ) : (
                    <h3>可执行行动</h3>
                )}

                {(this.state.options) && (
                    <p>{this.state.options.text}</p>
                )}
                {(this.state.options) && (
                    <div className="actions">
                        <ul>
                            {this.state.options.options.map(o => (
                                <li>
                                    <input type="radio" value={o.value}/>
                                    {o.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        );
    }

    private channel!: BirminghamInstructionChannel;

    override componentDidMount(): void {
        this.channel = this.window.simulator.channels.get("birmingham_instruction").get() as BirminghamInstructionChannel;
        this.channel.listeners.DISPLAY_ACTION_OPTIONS.add(this.onReceiveDisplayActionOptions);
        this.channel.sendRequestActionOption();
    }

    override componentWillUnmount(): void {
        this.channel.listeners.DISPLAY_ACTION_OPTIONS.remove(this.onReceiveDisplayActionOptions);
    }

    onReceiveDisplayActionOptions = (options: ActionOptionsData) => {
        this.setState({ options });
    }


}