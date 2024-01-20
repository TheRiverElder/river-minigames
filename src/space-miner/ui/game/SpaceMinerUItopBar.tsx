import { Component, ReactNode } from "react"
import { int } from "../../../libs/CommonTypes";
import { toPercentString } from "../../../libs/lang/Extensions";
import SpaceMinerGameClientCommonProps from "../common";

export default class SpaceMinerUITopBar extends Component<SpaceMinerGameClientCommonProps> {

    override componentDidMount(): void {
        const game = this.props.game;
        game.listeners.UI_UPDATE.add(this.onTick);
    }

    override componentWillUnmount(): void {
        const game = this.props.game;
        game.listeners.UI_UPDATE.remove(this.onTick);
    }

    onTick = () => {
        this.forceUpdate();
    };

    override render(): ReactNode {

        const game = this.props.game;
        const i18n = this.props.i18n;
        const client = this.props.gameRuleController;
        const profile = game.profile;
        const tickCounter = game.world.tickCounter;

        const f = (a: int, b: int) => Math.floor(tickCounter / a) % b;

        const year = f(24 * 30 * 12, Number.POSITIVE_INFINITY) + 2023;
        const month = f(24 * 30, 12) + 10;
        const date = f(24, 30) + 6;

        const displayTime = new Date(year, month, date + 1);

        return (
            <div className="top-bar">
                <div className="name">{i18n.get(`ui.game.top_bar.name`)}: {profile.name}</div>
                <div className="property">{i18n.get(`ui.game.top_bar.account`)}: {profile.account.toFixed(2)}</div>
                <div className="property">{i18n.get(`ui.game.top_bar.time`)}: {displayTime.toLocaleDateString()}</div>
                <div className="property">{i18n.get(`ui.game.top_bar.time_speed`)}: {client.getTimeSpeed()}tps</div>
                {game.level.goals.map(goal => (
                    <div className="property">{ goal.getName().process(i18n) }: { toPercentString(goal.getProgress()) }</div>
                ))}
            </div>
        );
    }
}