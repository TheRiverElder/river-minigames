import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Communication from "../Communication";
import TableBottomSimulatorClient from "../TableBottomSimulatorClient";

export default class WebSocketCommunication extends Communication {

    readonly url: string;
    private webSocket: Nullable<WebSocket> = null;
    maxTryTimes: int = 5;
    tryCounter: int = 0;

    constructor(simulator: TableBottomSimulatorClient, url: string, maxTryTimes: int = 5) {
        super(simulator);
        this.url = url;
        this.maxTryTimes = maxTryTimes;
    }

    start(force: boolean = false) {
        if (!!this.webSocket && this.webSocket.readyState === WebSocket.OPEN) return;

        if (force) {
            this.tryCounter = 0;
        } else if (this.tryCounter > this.maxTryTimes) {
            console.log(`Reach max try times: ${this.maxTryTimes}`);
            return;
        }

        this.tryCounter++;
        const ws = new WebSocket(this.url);

        ws.onopen = () => {
            console.log("Connected", ws.url);
            this.simulator.onServerConnected.emit(this);
            this.start();
        };
        ws.onclose = () => {
            console.log("Disonnected", ws.url);
            this.simulator.onServerDisconnected.emit(this);
        };
        ws.onerror = (e) => console.log("Error", e);
        ws.onmessage = (e) => this.receiveRawData(e.data as string);

        this.webSocket = ws;
    }

    stop() {
        if (!this.webSocket) return;
        this.webSocket.close(200, "Close communication");
        this.webSocket = null;
    }

    sendRawData(rawData: string): void {
        this.webSocket?.send(rawData);
    }

}