import { Component, ReactNode } from "react";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./ConsoleView.scss";

export interface ConsoleViewState {
    code: string;
}

export default class ConsoleView extends Component<SpaceMinerUICommonProps, ConsoleViewState> {

    constructor(props: SpaceMinerUICommonProps) {
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
        const func = new Function("game", code);
        func(this.props.game);
    }
}