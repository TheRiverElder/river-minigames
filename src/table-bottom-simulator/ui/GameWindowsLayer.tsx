import { Component, ReactNode } from "react";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";

export default class GameWindowsLayer extends Component<{simulator: TableBottomSimulatorClient}> {

    

    render(): ReactNode {
        return (
            <div>
                {this.props.simulator.windows.values().map(window => window.render())}
            </div>
        )
    }
}