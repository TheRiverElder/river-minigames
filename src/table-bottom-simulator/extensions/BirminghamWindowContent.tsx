import { FormEvent, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import Optional from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import { GameWindowContent, GameWindow } from "../TableBottomSimulatorClient";
import { ACTION_TYPES } from "./action/ActionType";
import "./BirminghamWindowContent.scss";
import BirminghamInstructionChannel, { ActionOptionsData, GameStateData } from "./channels/BirminghamInstructionChannel";

export interface BirminghamWindowContentProps {
    window: GameWindow;
}

export interface BirminghamWindowContentState {
    options: ActionOptionsData | null;
    gameState: GameStateData | null;
    gamerAmount: int;
    gamerOrdinal: int;
    optionIndex: int;
}

export default class BirminghamWindowContent extends GameWindowContent<BirminghamWindowContentProps, BirminghamWindowContentState> {

    constructor(props: BirminghamWindowContentProps) {
        super(props);
        const window = props.window;
        window.name = "Birmingham";
        window.size = new Vector2(300, 500);
        this.state = {
            options: null,
            gameState: null,
            gamerAmount: 2,
            gamerOrdinal: -1,
            optionIndex: -1,
        };
    }

    override render(): ReactNode {
        const window = this.props.window;
        const gameState = this.state.gameState;
        const occupied = gameState?.gamerList?.some(it => it.userUid === window.simulator.selfUserUid) ?? false;

        return (
            <div className="BirminghamWindowContent">
                {gameState ? (
                    occupied ? this.renderSectionGameState(gameState) : this.renderSectionOccupyGamer(gameState)
                ) : this.renderSectionCreateGame()}
                {this.renderSectionOptions()}
            </div>
        );
    }

    private renderSectionGameState(gameState: GameStateData) {
        const window = this.props.window;
        return [
            // 所有玩家信息
            <h3> 玩家信息</h3>,
            <div className="player-list">
                {gameState.gamerList.map(gamer => (
                    <ul className="user">
                        <li>
                            {window.simulator.users.get(gamer.userUid).map(it => it.name).orElse("<未落座>")} 有{gamer.money}钱，有{gamer.cardAmount}张手牌
                        </li>
                    </ul>
                ))}
            </div>
        ];
    }

    private renderSectionCreateGame() {
        const window = this.props.window;
        return [
            <h3>创建游戏</h3>,
            <form className="create-game" onSubmit={this.createGame}>
                <div>
                    <span>人数</span>
                    <input
                        type="range" min={2} max={4} step={1}
                        value={this.state.gamerAmount}
                        onChange={e => this.setState({ gamerAmount: parseInt(e.target.value) })}
                    />
                    <input
                        type="number" min={2} max={4} step={1}
                        value={this.state.gamerAmount}
                        onChange={e => this.setState({ gamerAmount: parseInt(e.target.value) })}
                    />
                </div>
                <div>
                    <input type="submit" value={"创建"} />
                </div>
            </form>
        ];
    }

    private renderSectionOccupyGamer(gameState: GameStateData) {
        const window = this.props.window;
        return [
            <h3>选座</h3>,
            <form className="occupy-gamer" onSubmit={this.occupyGamer}>
                <div>
                    <span>序次</span>
                    <select
                        value={this.state.gamerOrdinal}
                        onChange={e => this.setState({ gamerOrdinal: parseInt(e.target.value) })}
                    >
                        <option value={-1}>-请选择-</option>
                        {gameState.gamerList.filter(it => typeof it.userUid !== 'number').map(it => (
                            <option value={it.ordinal}>{it.ordinal}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <input type="submit" value={"坐下"} />
                </div>
            </form>
        ];
    }

    private createGame = (event: FormEvent) => {
        event.preventDefault();
        const data = {
            gamerAmount: this.state.gamerAmount,
        };
        this.channel.sendCreateGame(data);
    }

    private occupyGamer = (event: FormEvent) => {
        event.preventDefault();
        const { gamerOrdinal } = this.state;
        if (typeof gamerOrdinal !== 'number' || gamerOrdinal < 0) return;

        const data = {
            gamerOrdinal,
        };
        this.channel.sendOccupyGamer(data);
    }

    private renderSectionOptions() {
        const window = this.props.window;
        if (!this.state.options) return (<h3>不可执行行动</h3>);

        return (
            <form onSubmit={this.chooseActionOption}>
                <h3>可执行行动</h3>
                <p>{this.state.options.text}</p>
                <ul>
                    {this.state.options.options.map((o, i) => (
                        <li>
                            <input
                                type="radio"
                                value={i}
                                checked={i === this.state.optionIndex}
                                onChange={e => this.setState({ optionIndex: i })}
                            />
                            {o.text}
                        </li>
                    ))}
                </ul>
                <div>
                    <input type="submit" value={"选择"} />
                </div>
            </form>
        );
    }

    private chooseActionOption = (event: FormEvent) => {
        event.preventDefault();
        const { optionIndex } = this.state;
        if (typeof optionIndex !== 'number' || optionIndex < 0) return;

        this.channel.sendChooseActionOption({ optionIndex });
    }

    private channel!: BirminghamInstructionChannel;

    override componentDidMount(): void {
        this.channel = this.window.simulator.channels.get("birmingham_instruction").get() as BirminghamInstructionChannel;
        this.channel.listeners.DISPLAY_ACTION_OPTIONS.add(this.onReceiveDisplayActionOptions);
        this.channel.listeners.UPDATE_GAME_STATE.add(this.onReceiveUpdateGameState);
        this.channel.sendRequestActionOption();
        this.channel.sendRequestGameState();
    }

    override componentWillUnmount(): void {
        this.channel.listeners.DISPLAY_ACTION_OPTIONS.remove(this.onReceiveDisplayActionOptions);
        this.channel.listeners.UPDATE_GAME_STATE.remove(this.onReceiveUpdateGameState);
    }

    onReceiveDisplayActionOptions = (options: ActionOptionsData) => {
        this.setState({ options });
    }

    onReceiveUpdateGameState = (gameState: GameStateData | null) => {
        this.setState({ gameState });
    }


}