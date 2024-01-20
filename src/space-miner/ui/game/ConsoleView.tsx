import { Component, ReactNode } from "react";
import SpaceMinerGameClientCommonProps from "../common";
import "./ConsoleView.scss";

export interface ConsoleViewState {
    code: string;
}

export default class ConsoleView extends Component<SpaceMinerGameClientCommonProps, ConsoleViewState> {

    constructor(props: SpaceMinerGameClientCommonProps) {
        super(props);
        this.state = {
            code: "",
        };
    }

    render(): ReactNode {
        return (
            <div className="ConsoleView">
                <div className="output"></div>
                <div className="input">
                    <input value={this.state.code} onChange={(e) => this.setState({ code: e.currentTarget.value })}/>
                    <button onClick={() => this.execute()}>Execute</button>
                </div>
            </div>
        );
    }

    execute() {
        const code = this.state.code;
        // eslint-disable-next-line no-new-func
        const func = new Function("game", code); 
        func(this.props.game);
    }
}