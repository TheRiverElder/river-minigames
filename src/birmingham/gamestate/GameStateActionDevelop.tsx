import { Component, ReactNode } from "react";
import { Industries } from "../Constants";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionDevelopState {
    industries: Array<string>;
}

export default class GameStateActionDevelop extends Component<GameStateViewProps, GameStateActionDevelopState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            industries: ["", ""],
        };
    }

    render(): ReactNode {
        return (
            <div>
                <h2>选择1或2个工厂研发</h2>
                <div className="industries">
                    {Object.values(Industries).map((industry, index) => (
                        <div>
                            {this.state.industries.map((selectedIndustry, ordinal) => (
                                <input 
                                    type="radio" 
                                    checked={selectedIndustry === industry}
                                    disabled={selectedIndustry !== industry && this.state.industries.every(i => i !== "")}
                                    onClick={() => {
                                        const industries = this.state.industries.slice();
                                        industries[ordinal] = industries[ordinal] === industry ? "" : industry;
                                        this.setState({ industries });
                                    }}
                                />
                            ))}
                            <label>{industry}</label>
                        </div>
                    ))}
                </div>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    canPerform() {
        const counter = this.state.industries.filter(i => i !== "").length;
        return (counter >= 1 && counter <= 2);
    }

    perform() {
        this.props.rpc.call("performAction", {
            industries: this.state.industries.filter(i => i !== ""),
        }).then(() => this.props.refresh());
    }

}