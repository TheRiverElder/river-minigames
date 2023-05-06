import { Component, ReactNode } from "react"
import { Nullable } from "../../libs/lang/Optional";
import { initializeBasic } from "../builtin/BasicInitialization";
import initializeTest from "../builtin/Test";
import WebSocketCommunication from "../communication/WebSocketCommunication";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";
import TableBottomSimulatorView from "./TableBottomSimulatorView";

interface EntryState {
    url: string;
    simulator: Nullable<TableBottomSimulatorClient>;
}

export default class Entry extends Component<{}, EntryState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            url: "ws://localhost:8081/minigames/tbs?userUid=2",
            simulator: null,
        };
    }

    render(): ReactNode {
        if (this.state.simulator) return (<TableBottomSimulatorView simulator={this.state.simulator} />)
        else return (
            <div>
                <input 
                    type="text"
                    value={this.state.url}
                    onChange={e => this.setState({ url : e.target.value })}
                />
                <button onClick={() => this.setState({ simulator: initializeSimulator(this.state.url) })}>Connect</button>
            </div>
        )
    }
}


function initializeSimulator(url: string) {
    
    const u = new URL(url);

    const params = u.searchParams;

    const simulator = new TableBottomSimulatorClient(parseInt(params.get("userUid") || "0"));
    initializeBasic(simulator);
    initializeTest(simulator);
    
    const communication = new WebSocketCommunication(
        simulator, 
        url, 
        5,
    );
    simulator.communication = communication;
    communication.start();

    return simulator;
}