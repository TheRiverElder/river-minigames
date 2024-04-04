import { Component, createRef, ReactNode } from "react";
import { Consumer, IsolatedFunction } from "../../../libs/CommonTypes";
import { OrbInfoModel } from "../../model/orb/Orb";
import PixiAdapter from "../graphics/PixiAdapter";
import { Nullable } from "../../../libs/lang/Optional";
import { GameModel } from "../../model/global/Game";
import "./WorldView.scss";
import { SpaceMinerGameClientCommonProps } from "../common";

export interface WorldViewProps extends SpaceMinerGameClientCommonProps {
    onClickOrb?: Consumer<OrbInfoModel>;
}

export interface WorldViewState {
    game: Nullable<GameModel>;
}

export default class WorldView extends Component<WorldViewProps, WorldViewState> {

    state: WorldViewState = {
        game: null,
    };

    private adapter!: PixiAdapter;

    private onUpdate = (game: GameModel) => {
        this.adapter?.refresh(game);
        this.adapter?.app.render();
        // console.log("refesh", this.adapter.orbGaphicDataMap.size());
        // this.forceUpdate();
    };

    private readonly disposeFunctions: IsolatedFunction[] = [];

    override componentDidMount(): void {
        const canvas = this.refCanvas.current;
        if (!!canvas) {
            this.adapter = new PixiAdapter(this.props.gameApi, canvas, this.props.resources);
            this.adapter.onClickOrb = this.props.onClickOrb || null;
            this.disposeFunctions.push(this.props.gameApi.channelGameUpdate.listeners.UPDATE.add((g) => this.setState({ game: g })));
        }
    }

    override componentWillUnmount(): void {
        this.disposeFunctions.forEach(it => it());
        this.adapter.dispose();
        // this.props.game.listeners.UI_UPDATE.remove(this.onUpdate);
    }

    private readonly refCanvas = createRef<HTMLCanvasElement>();

    override render(): ReactNode {
        const { game } = this.state;
        if (game) {
            this.onUpdate(game);
        }

        return (
            <div className="WorldView">
                <canvas ref={this.refCanvas} />
            </div>
        );
    }
}
