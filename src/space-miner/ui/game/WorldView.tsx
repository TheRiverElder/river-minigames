import { Component, createRef, ReactNode } from "react";
import { Consumer } from "../../../libs/CommonTypes";
import Orb from "../../model/orb/Orb";
import Profile from "../../model/Profile";
import World from "../../model/World";
import SpaceMinerGameClientCommonProps from "../common";
import PixiAdapter from "../graphics/PixiAdapter";

export interface WorldViewProps extends SpaceMinerGameClientCommonProps {
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
        return (
            <div className="SpaceView">
                <canvas ref={this.refCanvas}/>
            </div>
        );
    }
}
