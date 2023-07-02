import { Component, ReactNode } from "react";
import ObjectBasedRpcClient from "../../libs/rpc/ObjectBasedRpcClient";
import RpcClient from "../../libs/rpc/RpcClient";
import GameState, { GameStateRenderContext } from "../GameState";
import GameStateIdle from "../gamestate/GameStateIdle";
import TestServer from "../TestServer";

export interface BirminghamViewState {
    gameState: GameState;
}

export default class BirminghamView extends Component<any, BirminghamViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            gameState: new GameStateIdle(),
        };
    }

    readonly rcpClient: RpcClient = new ObjectBasedRpcClient(new TestServer());

    render(): ReactNode {
        const context: GameStateRenderContext = {
            profile: { cards:[] },
            rpc: this.rcpClient,
            updateUi: () => this.forceUpdate(),
        };

        return (
            <div>
                {this.state.gameState.render(context)}
            </div>
        );
    }
}