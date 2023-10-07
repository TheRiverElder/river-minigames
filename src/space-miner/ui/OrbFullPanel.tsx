import { Component, ReactNode } from "react";
import Orb from "../model/orb/Orb";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface OrbFullPanelProps extends SpaceMinerUICommonProps {
    orb: Orb;
}

export interface OrbFullPanelState {

}

export default class OrbFullPanel extends Component<OrbFullPanelProps, OrbFullPanelState> {

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
        return (
            <div className="OrbFullPanel">

            </div>
        );
    }
}