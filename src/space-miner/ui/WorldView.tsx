import { Component, ReactNode } from "react";
import World from "../model/World";
import OrbView from "./OrbView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface WorldViewProps extends SpaceMinerUICommonProps {
    world: World;
}

export default class WorldView extends Component<WorldViewProps> {

    private onUpdate = () => {
        this.forceUpdate();
    };

    override componentDidMount(): void {
        this.props.game.onTickListener.add(this.onUpdate);
    }

    override componentWillUnmount(): void {
        this.props.game.onTickListener.remove(this.onUpdate);
    }


    override render(): ReactNode {
        const orbs = this.props.world.orbs.values();
        const { game, i18n } = this.props;
        return (
            <div className="SpaceView">
                {orbs.map(orb => (
                    <OrbView key={orb.uid} orb={orb} game={game} i18n={i18n} />
                ))}
            </div>
        );
    }
}
