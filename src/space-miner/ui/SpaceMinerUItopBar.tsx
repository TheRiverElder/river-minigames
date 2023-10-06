import { Component, ReactNode } from "react"
import { int } from "../../libs/CommonTypes";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export default class SpaceMinerUItopBar extends Component<SpaceMinerUICommonProps> {

    override componentDidMount(): void {
        const game = this.props.game;
        game.onTickListener.add(this.onTick);
    }

    override componentWillUnmount(): void {
        const game = this.props.game;
        game.onTickListener.remove(this.onTick);
    }

    onTick = () => {
        this.forceUpdate();
    };

    override render(): ReactNode {

        const game = this.props.game;
        const client = this.props.client;
        const profile = game.profile;
        const tickCounter = game.world.tickCounter;

        const f = (a: int, b: int) => Math.floor(tickCounter / a) % b;

        const year = f(24 * 30 * 12, Number.POSITIVE_INFINITY) + 2023;
        const month = f(24 * 30 , 12) + 10;
        const date = f(24, 30) + 6;

        const displayTime = new Date(year, month, date + 1);

        return (
            <div className="top-bar">
                <div className="name">Name: {profile.name}</div>
                <div className="property">Account: {profile.account.toFixed(2)}</div>
                <div className="property">Time: {displayTime.toLocaleDateString()}</div>
                <div className="property">TimeSpeed: {client.timeSpeed}tps</div>
            </div>
        );
    }
}