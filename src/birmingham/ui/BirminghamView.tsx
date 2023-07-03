import { Component, ReactNode } from "react";
import ObjectBasedRpcClient from "../../libs/rpc/ObjectBasedRpcClient";
import RpcClient from "../../libs/rpc/RpcClient";
import GameStateActionBuild from "../gamestate/GameStateActionBuild";
import GameStateActionDevelop from "../gamestate/GameStateActionDevelop";
import GameStateActionLoan from "../gamestate/GameStateActionLoan";
import GameStateActionNetwork from "../gamestate/GameStateActionNetwork";
import GameStateActionScout from "../gamestate/GameStateActionScout";
import GameStateActionSell from "../gamestate/GameStateActionSell";
import GameStateChooseAction from "../gamestate/GameStateChooseAction";
import GameStateError from "../gamestate/GameStateError";
import GameStateIdle from "../gamestate/GameStateIdle";
import GameStateViewProps from "../gamestate/GameStateViewProps";
import Profile from "../Profile";
import TestServer from "../TestServer";

export interface BirminghamViewState {
    gameStateType: string;
    gameStateData: any;
    profile: Profile;
}

export default class BirminghamView extends Component<any, BirminghamViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            profile: {
                cards:[],
                action: null,
            },
            gameStateType: "idle",
            gameStateData: null,
        };
    }

    componentDidMount(): void {
        this.refresh();
    }

    readonly rcpClient: RpcClient = new ObjectBasedRpcClient(new TestServer());

    render(): ReactNode {

        return (
            <div>
                <h2>当前行动：{this.state.profile.action?.type || "无"}</h2>
                <button onClick={() => this.resetRound()}>重置当前回合</button>
                <button onClick={() => this.resetAction()}>重置当前行动</button>
                {this.renderGameState(this.state.gameStateType, this.state.gameStateData)}
            </div>
        );
    }

    renderGameState(type: string, data: any) {

        const props: GameStateViewProps = {
            profile: this.state.profile,
            rpc: this.rcpClient,
            refresh: () => this.refresh(), 
            data,
        };
    
        switch (type) {
            case "idle": return (<GameStateIdle {...props} />);
            case "chooseAction": return (<GameStateChooseAction {...props} />);
            case "action/build": return (<GameStateActionBuild {...props} />);
            case "action/network": return (<GameStateActionNetwork {...props} />);
            case "action/loan": return (<GameStateActionLoan {...props} />);
            case "action/sell": return (<GameStateActionSell {...props} />);
            case "action/develop": return (<GameStateActionDevelop {...props} />);
            case "action/scout": return (<GameStateActionScout {...props} />);
            default: return (<GameStateError {...props} />);
        }
    }

    refresh() {
        this.rcpClient.call("getProfile").then(pack => this.setState({ profile: pack }));
        this.rcpClient.call("getState").then(pack => { 
            console.log("getState", pack);
            const type: string = pack.type;
            const data: any = pack.data;
            this.setState({ 
                gameStateType: type,
                gameStateData: data,
            });
        });
    }

    async resetRound() {
        await this.rcpClient.call("resetRound");
        this.refresh();
    }

    async resetAction() {
        await this.rcpClient.call("resetAction");
        this.refresh();
    }
}