import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";
import { Location, locationEquals } from "../Types";
import { CITIES, Industries } from "../Constants";
import { int } from "../../libs/CommonTypes";
import BirminghamMapView from "../ui/BirminghamMapView";

export interface GameStateActionBuildState {
    industry: Nullable<string>;
    location: Nullable<Location>;
}

export default class GameStateActionBuild extends Component<GameStateViewProps, GameStateActionBuildState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industry: null,
            location: null,
        };
    }

    render(): ReactNode {
        const location = this.state.location;

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
                    scale={0.2}
                    industrySlots={{
                        isHidden: () => false,
                        isSelectable: () => location === null,
                        hasSelected: (loc) => locationEquals(loc, location),
                        onClick: (loc) => {
                            if (locationEquals(loc, location)) {
                                this.setState({ location: null });
                            } else this.setState({ location: loc });
                        },
                    }}
                />
            </div>
        )
    }

    canPerform() {
        return !!this.state.industry && !!this.state.location;
    }

    perform() {
        this.props.rpc.call("performAction", {
            industry: this.state.industry,
            location: this.state.location,
        }).then(() => this.props.refresh());
    }

}