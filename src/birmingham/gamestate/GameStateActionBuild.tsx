import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";
import { Location } from "../Types";
import { CITIES, Industries } from "../Constants";
import { int } from "../../libs/CommonTypes";

export interface GameStateActionBuildState {
    industry: Nullable<string>;
    locationCity: Nullable<string>;
    locationIndustySlotIndex: Nullable<int>;
}

export default class GameStateActionBuild extends Component<GameStateViewProps, GameStateActionBuildState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industry: null,
            locationCity: null,
            locationIndustySlotIndex: null,
        };
    }

    render(): ReactNode {
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
                <div className="cities">
                    {CITIES.map(city => (
                        <div onClick={() => {
                            if (this.state.locationCity !== city.name) this.setState({ locationCity: city.name, locationIndustySlotIndex: null });
                        }}>
                            <input 
                                type="radio" 
                                name="city" 
                                value={city.name} 
                                checked={this.state.locationCity === city.name}
                            />
                            <label>{city.name}</label>
                            {this.state.locationCity === city.name && city.industrySlots.map((slot, index) => (
                                <div onClick={() => this.setState({ locationIndustySlotIndex: index })}>
                                    <span>{index} - </span>
                                    <input 
                                        type="radio" 
                                        name="index" 
                                        value={index} 
                                        checked={this.state.locationIndustySlotIndex === index}
                                    />
                                    <label>{slot.join(" | ")}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    canPerform() {
        return (this.state.industry !== null && this.state.locationCity !== null && this.state.locationIndustySlotIndex !== null);
    }

    perform() {
        this.props.rpc.call("performAction", {
            industry: this.state.industry,
            location: [this.state.locationCity, this.state.locationIndustySlotIndex],
        }).then(() => this.props.refresh());
    }

}