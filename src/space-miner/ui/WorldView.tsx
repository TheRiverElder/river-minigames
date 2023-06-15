import { Component, ReactNode } from "react";
import { Consumer } from "../../libs/CommonTypes";
import Orb from "../model/orb/Orb";
import Profile from "../model/Profile";
import World from "../model/World";
import OrbView from "./OrbView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface WorldViewProps extends SpaceMinerUICommonProps {
    world: World;
    profile: Profile;
    onClickOrb?: Consumer<Orb>;
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
        const { profile, game, i18n } = this.props;
        return (
            <div className="SpaceView">
                {orbs.map(orb => (
                    <OrbView key={orb.uid} orb={orb} profile={profile} onClickOrb={this.props.onClickOrb} game={game} i18n={i18n} />
                ))}
            </div>
        );
    }
}
