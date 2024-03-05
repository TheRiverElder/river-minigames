import { FormEvent, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import BirminghamExtension from "./BirminghamExtension";
import BirminghamGame from "./BirminghamGame";
import BirminghamGamer from "./BirminghamGamer";
import "./BirminghamWindowContent.scss";
import { ActionOptionsData } from "./channels/BirminghamInstructionChannel";
import { GameWindow, GameWindowContent } from "../simulator/TableBottomSimulatorClient";

export interface BirminghamWindowContentProps {
    window: GameWindow;
}

export interface BirminghamWindowContentState {
    options: ActionOptionsData | null;
    gamerAmount: int;
    gamerUid: int;
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
            gamerAmount: 2,
            gamerUid: -1,
            optionIndex: -1,
        };
    }

    override render(): ReactNode {
        const window = this.props.window;
        const game = this.extension?.game ?? null;
        const occupied = game?.gamerList?.some(it => it.user?.uid === window.simulator.selfUserUid) ?? false;

        return (
            <div className="BirminghamWindowContent">
                {this.props.window.simulator.selfUser.isEditor && this.renderSimulationOptions()}
                {game ? (
                    occupied ? this.renderSectionGameState(game) : this.renderSectionOccupyGamer(game)
                ) : this.renderSectionCreateGame()}
                {this.renderSectionOptions()}
            </div>
        );
    }

    // TODO 以后要新开个窗口
    private renderSimulationOptions() {
        // const window = this.props.window;
        return (
            <div>
                <h3>模拟器操作</h3>
                <button onClick={() => this.props.window.simulator.channelFullUpdate.send({ action: "write_to_autosave" })}>触发自动保存</button>
                <button onClick={() => this.props.window.simulator.channelFullUpdate.send({ action: "read_from_autosave" })}>从自动保存载入</button>
                <button onClick={() => this.extension.channel.sendOrganizeMap()}>自组地图</button>
                <button onClick={() => this.extension.channel.sendCreateEmptyCityObject()}>创建空城市</button>
                <button onClick={() => this.extension.channel.sendCreateEmptyNetworkObject()}>创建空路网</button>
                <button onClick={() => this.extension.channel.sendCreateEmptyMarketObject()}>创建空市场</button>
            </div>
        );
    }

    private renderSectionGameState(game: BirminghamGame) {
        // const window = this.props.window;
        return (
            <div>
                {/* // 所有玩家信息 */}
                <h3> 玩家信息</h3>
                <div className="player-list">
                    <ul className="user">
                        {game.gamerList.map(gamer => (
                            <li key={gamer.gamerUid}>
                                {(gamer.ordinal === this.extension.game?.currentOrdinal) && (<span>★</span>)}
                                <span>{gamer.ordinal} - </span>
                                <span>
                                    {gamer.user?.name ?? "<未落座>"} 有{gamer.money}钱，有{gamer.gamer?.cardAmount}张手牌
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button onClick={this.unoccupyGamer}>离座</button>
                </div>
            </div>
        );
    }

    private renderSectionCreateGame() {
        // const window = this.props.window;
        return (
            <div>
                <h3>创建游戏</h3>
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
            </div>
        );
    }

    private createGame = (event: FormEvent) => {
        event.preventDefault();
        const data = {
            gamerAmount: this.state.gamerAmount,
        };
        this.extension.channel.sendCreateGame(data);
    }

    private renderSectionOccupyGamer(game: BirminghamGame) {
        // const window = this.props.window;

        function canSelect(birminghamGamer: BirminghamGamer): boolean {
            if (typeof (birminghamGamer.gamer?.userUid) !== 'number') return true;
            return false;
        }

        return (
            <div>
                <h3>选座</h3>
                <form className="occupy-gamer" onSubmit={this.occupyGamer}>
                    <div>
                        <span>序次</span>
                        <select
                            value={this.state.gamerUid}
                            onChange={e => this.setState({ gamerUid: parseInt(e.target.value) })}
                        >
                            <option value={-1}>-请选择-</option>
                            {game.gamerList.filter(canSelect).map(it => (
                                <option key={it.gamerUid} value={it.gamerUid}>{it.ordinal}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input type="submit" disabled={typeof this.state.gamerUid !== 'number' || this.state.gamerUid < 0} value={"坐下"} />
                    </div>
                </form>
            </div>
        );
    }

    private occupyGamer = (event: FormEvent) => {
        event.preventDefault();
        const { gamerUid } = this.state;
        if (typeof gamerUid !== 'number' || gamerUid < 0) return;

        this.extension.simulator.channelGamePlayer.sendOccupyGamer(gamerUid);
    }

    private unoccupyGamer = () => {
        this.setState({ options: null });
        this.extension.simulator.channelGamePlayer.sendOccupyGamer(-1);
        this.extension.channel.sendRequestActionOption();
    }

    private renderSectionOptions() {
        // const window = this.props.window;
        if (!this.state.options) return (<h3>不可执行行动</h3>);

        return (
            <div>
                <h3>可执行行动</h3>
                <p>{this.state.options.text}</p>
                <ul>
                    {this.state.options.options.map((o, i) => (
                        <li onClick={() => this.setState({ optionIndex: i })}>
                            <label>
                                <input
                                    type="radio"
                                    value={i}
                                    checked={i === this.state.optionIndex}
                                />
                                {o.text}
                            </label>
                        </li>
                    ))}
                </ul>
                <div>
                    <button onClick={this.chooseActionOption}>选择</button>
                    <button onClick={() => this.extension.channel.sendResetActionOptions()}>重置选择</button>
                </div>
            </div>
        );
    }

    private chooseActionOption = (event: FormEvent) => {
        event.preventDefault();
        const { optionIndex } = this.state;
        if (typeof optionIndex !== 'number' || optionIndex < 0) return;

        this.extension.channel.sendChooseActionOption({ optionIndex });
    }

    private extension!: BirminghamExtension;

    override componentDidMount(): void {
        this.extension = this.window.simulator.extensions.getOrThrow("birmingham") as BirminghamExtension;

        this.extension.channel.listeners.DISPLAY_ACTION_OPTIONS.add(this.onReceiveDisplayActionOptions);
        this.extension.channel.listeners.GAME_STATE_UPDATED.add(this.doRequestUpdate);
        this.extension.simulator.channelGamePlayer.listeners.USERS_UPDATED.add(this.doRequestUpdate);
        this.extension.simulator.channelGamePlayer.listeners.GAMERS_UPDATED.add(this.doRequestUpdate);
        this.extension.channel.sendRequestActionOption();
        this.extension.channel.sendRequestGameState();
    }

    override componentWillUnmount(): void {
        this.extension.channel.listeners.DISPLAY_ACTION_OPTIONS.remove(this.onReceiveDisplayActionOptions);
        this.extension.channel.listeners.GAME_STATE_UPDATED.remove(this.doRequestUpdate);
        this.extension.simulator.channelGamePlayer.listeners.USERS_UPDATED.remove(this.doRequestUpdate);
        this.extension.simulator.channelGamePlayer.listeners.GAMERS_UPDATED.remove(this.doRequestUpdate);
    }

    onReceiveDisplayActionOptions = (options: ActionOptionsData) => {
        this.setState({ options });
    }

    doUpdate = () => {
        this.forceUpdate();
    }

    doRequestUpdate = () => {
        this.extension.channel.sendRequestActionOption();
        this.forceUpdate();
    }


}