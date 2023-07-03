import { Component, ReactNode } from "react";
import ObjectBasedRpcClient from "../../libs/rpc/ObjectBasedRpcClient";
import RpcClient from "../../libs/rpc/RpcClient";
import GameState, { GameStateRenderContext } from "../GameState";
import GameStateActionBuild from "../gamestate/GameStateActionBuild";
import GameStateActionDevelop from "../gamestate/GameStateActionDevelop";
import GameStateActionLoan from "../gamestate/GameStateActionLoan";
import GameStateActionNetwork from "../gamestate/GameStateActionNetwork";
import GameStateActionScout from "../gamestate/GameStateActionScout";
import GameStateActionSell from "../gamestate/GameStateActionSell";
import GameStateChooseAction from "../gamestate/GameStateChooseAction";
import GameStateIdle from "../gamestate/GameStateIdle";
import GameStateViewProps from "../gamestate/GameStateViewProps";
import TestServer from "../TestServer";

export interface BirminghamViewState {
    gameStateType: string;
    gameStateData: any;
}

export default class BirminghamView extends Component<any, BirminghamViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            gameStateType: "idle",
            gameStateData: null,
        };
    }

    readonly rcpClient: RpcClient = new ObjectBasedRpcClient(new TestServer());

    render(): ReactNode {

        return (
            <div>
                {this.renderGameState(this.state.gameStateType, this.state.gameStateData)}
            </div>
        );
    }

    renderGameState(type: string, data: any) {

        const props: GameStateViewProps = {
            profile: {cards:[]},
            rpc: this.rcpClient,
            refresh: () => this.refresh(), 
            data,
        };
    
        switch (type) {
            case "idle": return (<GameStateIdle {...props} />);
            case "chooseAction": return (<GameStateChooseAction {...props} />);
            case "actionBuild": return (<GameStateActionBuild {...props} />);
            case "actionNetwork": return (<GameStateActionNetwork {...props} />);
            case "actionLoan": return (<GameStateActionLoan {...props} />);
            case "actionSell": return (<GameStateActionSell {...props} />);
            case "actionDevelop": return (<GameStateActionDevelop {...props} />);
            case "actionScout": return (<GameStateActionScout {...props} />);
        }
    }

    refresh() {
        this.rcpClient.call("getState").then(pack => { 
            const type: string = pack.type;
            const data: any = pack.data;
            this.setState({ 
                gameStateType: type,
                gameStateData: data,
            });
        });
    }
}