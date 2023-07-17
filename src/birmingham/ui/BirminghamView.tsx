import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import ObjectBasedRpcClient from "../../libs/rpc/ObjectBasedRpcClient";
import RpcClient from "../../libs/rpc/RpcClient";
import LoadingView from "../../libs/ui/LoadingView";
import Profile from "../data/Profile";
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
import TestServer from "../TestServer";
import "./BirminghamView.scss";

export interface BirminghamViewState {
    gameStateType: string;
    gameStateData: any;
    profile: Nullable<Profile>;
}

export default class BirminghamView extends Component<any, BirminghamViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            profile: null,
            gameStateType: "idle",
            gameStateData: null,
        };
    }

    componentDidMount(): void {
        this.refresh();
    }

    readonly rcpClient: RpcClient = new ObjectBasedRpcClient(new TestServer());

    render(): ReactNode {
        const profile = this.state.profile;
        if (!profile) return (
            <div className="BirminghamView">
                <LoadingView/>
            </div>
        );

        return (
            <div className="BirminghamView">
                <h2>当前行动：{profile.state?.type || "无"}</h2>
                <button onClick={() => this.resetRound()}>重置当前回合</button>
                <button onClick={() => this.resetAction()}>重置当前行动</button>
                {this.renderGameState(this.state.gameStateType, this.state.gameStateData)}
            </div>
        );
    }

    renderGameState(type: string, data: any) {
        const profile = this.state.profile;
        if (!profile) return (<div>加载中，请稍等</div>);

        const props: GameStateViewProps = {
            profile,
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