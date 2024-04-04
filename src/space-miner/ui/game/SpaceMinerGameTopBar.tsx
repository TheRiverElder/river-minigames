import { Component, ReactNode } from "react"
import { double, int, IsolatedFunction, Productor } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { toPercentString } from "../../../libs/lang/Extensions";
import { SpaceMinerGameClientCommonProps } from "../common";
import { openLevelStartDialog } from "../Utils";
import { Nullable } from "../../../libs/lang/Optional";
import { GameModel } from "../../model/global/Game";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";

export interface SpaceMinerGameTopBarState {
    game: Nullable<GameModel>;
    timeSpeed: double;
}

export default class SpaceMinerGameTopBar extends Component<SpaceMinerGameClientCommonProps, SpaceMinerGameTopBarState> {

    static readonly TEXT_NAME: Productor<any, Text> = (data) => new I18nText(`ui.game.top_bar.name`, data);
    static readonly TEXT_ACCOUNT: Productor<any, Text> = (data) => new I18nText(`ui.game.top_bar.account`, data);
    static readonly TEXT_TIME: Productor<any, Text> = (data) => new I18nText(`ui.game.top_bar.time`, data);
    static readonly TEXT_TIME_SPEED: Productor<any, Text> = (data) => new I18nText(`ui.game.top_bar.time_speed`, data);

    state: SpaceMinerGameTopBarState = {
        game: null,
        timeSpeed: 0,
    };

    private readonly disposeFunctions: IsolatedFunction[] = [];

    override componentDidMount(): void {
        this.disposeFunctions.push(this.props.gameApi.channelGameUpdate.listeners.UPDATE.add((g) => {
            this.setState({ game: g });
            this.props.gameApi.channelGameControl.requestGetTps().then(tps => this.setState({ timeSpeed: tps }))
        }));
    }

    override componentWillUnmount(): void {
        this.disposeFunctions.forEach(it => it());
    }

    onTick = () => {
        this.forceUpdate();
    };

    override render(): ReactNode {

        const game = this.state.game;
        if (!game) return;

        const { level, profile, world: { tickCounter } } = game;

        const i18n = this.props.i18n;

        const f = (a: int, b: int) => Math.floor(tickCounter / a) % b;

        const year = f(24 * 30 * 12, Number.POSITIVE_INFINITY) + 2023;
        const month = f(24 * 30, 12) + 10;
        const date = f(24, 30) + 6;

        const displayTime = new Date(year, month, date + 1);
        const displayTimeData = {
            year: displayTime.getFullYear(),
            month: displayTime.getMonth() + 1,
            date: displayTime.getDate(),
        };

        return (
            <div className="top-bar">
                <div className="info">
                    <div className="name">{i18n.get(`ui.game.top_bar.name`, { name: profile.name })}</div>
                    <div className="property">{i18n.get(`ui.game.top_bar.account`, { account: profile.account.toFixed(2) })}</div>
                    <div className="property">{i18n.get(`ui.game.top_bar.time`, displayTimeData)}</div>
                    <div className="property">{i18n.get(`ui.game.top_bar.time_speed`, { "time_speed": this.state.timeSpeed })}</div>
                </div>
                <div className="level">
                    {level.displayedGoals.map((goal, index) => (
                        <div key={index} className="property" onClick={() => openLevelStartDialog({ ...this.props, level })}>
                            {restoreTextAndProcess(goal.name, i18n)}: {toPercentString(goal.progress)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}