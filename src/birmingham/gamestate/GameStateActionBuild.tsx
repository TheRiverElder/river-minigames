import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";
import { Location, locationEquals } from "../Types";
import BirminghamMapView from "../ui/BirminghamMapView";
import { Industries } from "../data/Constants";
import { int } from "../../libs/CommonTypes";

export interface GameStateActionBuildState {
    industry: Nullable<string>;
    industrySlotUid: Nullable<int>;
}

export default class GameStateActionBuild extends Component<GameStateViewProps, GameStateActionBuildState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industry: null,
            industrySlotUid: null,
        };
    }

    render(): ReactNode {
        const industrySlotUid = this.state.industrySlotUid;

        return (
            <div>
                <h2>选择工业种类</h2>
                <div className="industries">
                    {Object.values(Industries).map(industry => (
                        <div onClick={() => this.setState({ industry })}>
                            <input 
                                type="radio" 
                                name="action" 
                                value={industry} 
                                checked={this.state.industry === industry}
                            />
                            <label>{industry}</label>
                        </div>
                    ))}
                </div>
                <h2>选择厂址</h2>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
                
                <BirminghamMapView 
                    game={this.props.game}
                    scale={0.2}
                    industrySlots={{
                        isHidden: () => false,
                        isSelectable: () => industrySlotUid === null,
                        hasSelected: (uid) => uid === industrySlotUid,
                        onClick: (uid) => {
                            if (uid === industrySlotUid) this.setState({ industrySlotUid: null });
                            else this.setState({ industrySlotUid: uid });
                        },
                    }}
                />
            </div>
        )
    }

    canPerform() {
        return !!this.state.industry && !!this.state.industrySlotUid;
    }

    perform() {
        this.props.rpc.call("performAction", {
            industry: this.state.industry,
            location: this.state.industrySlotUid,
        }).then(() => this.props.refresh());
    }

}