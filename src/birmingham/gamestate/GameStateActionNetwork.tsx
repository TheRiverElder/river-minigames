import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { LINKS } from "../Constants";
import BirminghamMapView from "../ui/BirminghamMapView";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionNetworkState {
    linkUid: Nullable<int>,
}

export default class GameStateActionNetwork extends Component<GameStateViewProps, GameStateActionNetworkState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            linkUid: null,
        };
    }
    
    render(): ReactNode {
        return (
            <div>
            <h2>选择工业种类</h2>
                <div className="links">
                    {LINKS.map(link => (
                        <div onClick={() => this.setState({ linkUid: link.uid })}>
                            <input 
                                type="radio" 
                                checked={this.state.linkUid === link.uid}
                            />
                            <label>{link.head}↔{link.tail}</label>
                        </div>
                    ))}
                </div>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
                <BirminghamMapView scale={0.2}/>
            </div>
        )
    }

    canPerform() {
        return this.state.linkUid !== null;
    }

    perform() {
        this.props.rpc.call("performAction", {
            linkUid: this.state.linkUid,
        }).then(() => this.props.refresh());
    }

}