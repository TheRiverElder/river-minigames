import { Component, createRef, ReactNode } from "react";
import { Consumer } from "../../libs/CommonTypes";
import Orb from "../model/orb/Orb";
import Profile from "../model/Profile";
import World from "../model/World";
import PixiAdapter from "./graphics/PixiAdapter";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface WorldViewProps extends SpaceMinerUICommonProps {
    world: World;
    profile: Profile;
    onClickOrb?: Consumer<Orb>;
}

export default class WorldView extends Component<WorldViewProps> {

    private adapter!: PixiAdapter;

    private onUpdate = () => {
        this.adapter.refresh();
        this.adapter.app.render();
        // console.log("refesh", this.adapter.orbGaphicDataMap.size());
        // this.forceUpdate();
        
    };

    override componentDidMount(): void {
        this.adapter = new PixiAdapter(this.props.game, this.refCanvas.current!!, this.props.resources);
        this.adapter.onClickOrb = this.props.onClickOrb || null;
        this.props.game.listeners.UI_UPDATE.add(this.onUpdate);
    }

    override componentWillUnmount(): void {
        this.adapter.dispose();
        this.props.game.listeners.UI_UPDATE.remove(this.onUpdate);
    }

    private readonly refCanvas = createRef<HTMLCanvasElement>();

    override render(): ReactNode {
        const orbs = this.props.world.orbs.values();
        const { profile, game, i18n } = this.props;
        return (
            <div className="SpaceView">
                {/* {orbs.map(orb => (
                    <OrbView key={orb.uid} orb={orb} profile={profile} onClickOrb={this.props.onClickOrb} game={game} i18n={i18n} />
                ))} */}
                <canvas ref={this.refCanvas}/>
            </div>
        );
    }
}
