import { Component, ReactNode } from "react"
import { Nullable } from "../../libs/lang/Optional";
import WebSocketCommunication, { CommunicationStatus, STATUS_CONNECTED, STATUS_CONNECTING, STATUS_DISCONNECTED, WebSocketStatusNotifier } from "../communication/WebSocketCommunication";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";
import TableBottomSimulatorView from "./TableBottomSimulatorView";
import "./TableBottomSimulatorEntry.scss";
import BirminghamExtension from "../extensions/BirminghamExtension";

interface EntryState {
    url: string;
    simulator: Nullable<TableBottomSimulatorClient>;
    communicationStatus: "connecting" | "connected" | "disconnected" | string;
}

export default class TableBottomSimulatorEntry extends Component<{}, EntryState> implements WebSocketStatusNotifier {

    constructor(props: {}) {
        super(props);
        this.state = {
            url: "ws://localhost:8081/minigames/tbs?userUid=2",
            simulator: null,
            communicationStatus: STATUS_DISCONNECTED,
        };
    }

    setStatus(status: CommunicationStatus): void {
        console.log("status", status);
        this.setState(s => ({ 
            communicationStatus: status,
            simulator: (status === STATUS_CONNECTED || status === STATUS_CONNECTING) ? s.simulator : null,
        }));
    }

    render(): ReactNode {
        if (this.state.simulator && this.state.communicationStatus === STATUS_CONNECTED) 
            return (<TableBottomSimulatorView simulator={this.state.simulator} />)
        
        return (
            <div className="TableBottomSimulatorEntry">
                <div className="status">
                    {this.renerStatus()}
                </div>

                <div className="url-input">
                    <span className="title">URL</span>
                    <input 
                        type="text"
                        disabled={this.state.communicationStatus !== STATUS_DISCONNECTED}
                        value={this.state.url}
                        onChange={e => this.setState({ url : e.target.value })}
                    />
                </div>
                
                {this.renderButtons()}
            </div>
        )
    }

    renerStatus() {
        switch(this.state.communicationStatus) {
            case STATUS_CONNECTING: return (<span>{createLoadingIcon()}连接中</span>);
            case STATUS_CONNECTED: return (<span>✔已连接</span>);
            case STATUS_DISCONNECTED: return (<span>❗未连接</span>);
            default: return (<span>{this.state.communicationStatus}</span>)
        }
    }

    renderButtons() {
        switch(this.state.communicationStatus) {
            case STATUS_CONNECTING: return (
                <div className="buttons">
                    <button onClick={this.cancel}>Cancel</button>
                </div>
            );
            case STATUS_DISCONNECTED: return (
                <div className="buttons">
                    <button disabled={!this.state.url} onClick={this.connect}>Connect</button>
                </div>
            );
            case STATUS_CONNECTED: return (
                <div className="buttons">
                    <button onClick={this.close}>Close</button>
                </div>
            );
        }
    }
    
    connect = () => {
    
        const urlString = this.state.url;
        const url = new URL(urlString);
    
        const params = url.searchParams;
    
        const simulator = new TableBottomSimulatorClient(parseInt(params.get("userUid") || "0"));
        simulator.addExtension(new BirminghamExtension(simulator));
        
        const communication = new WebSocketCommunication(
            simulator, 
            urlString, 
            5,
        );
        communication.statusNotifaier = this;
        simulator.communication = communication;
        communication.start();

        this.setState({ simulator: simulator });
    };

    cancel = () => {

    };

    close = () => {

    };
}

function createLoadingIcon() {
    return (<span className="loading"></span>);
}