import { Consumer, int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Communication from "./Communication";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";
import { NOP } from "../../libs/lang/Constants";

export interface WebSocketStatusNotifier {
    setStatus(status: CommunicationStatus): void;
}

export type CommunicationStatus = "connecting" | "connected" | "disconnected" | string;

export const STATUS_CONNECTING = "connecting";
export const STATUS_CONNECTED = "connected";
export const STATUS_DISCONNECTED = "disconnected";

export default class WebSocketCommunication extends Communication {

    readonly url: string;
    private webSocket: Nullable<WebSocket> = null;
    maxTryTimes: int = 5;
    tryCounter: int = 0;
    statusNotifaier: WebSocketStatusNotifier = { setStatus: NOP };

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
            const message = `Reach max try times: ${this.maxTryTimes}`;
            console.log(message);
            this.statusNotifaier.setStatus(message);
            return;
        }

        this.tryCounter++;
        const ws = new WebSocket(this.url);
        
        this.statusNotifaier.setStatus(STATUS_CONNECTING);

        ws.onopen = () => {
            console.log("Connected", ws.url);
            this.statusNotifaier.setStatus(STATUS_CONNECTED);
            this.simulator.onServerConnected.emit(this);
            this.start();
        };
        ws.onclose = () => {
            console.log("Disonnected", ws.url);
            this.statusNotifaier.setStatus(STATUS_DISCONNECTED);
            this.simulator.onServerDisconnected.emit(this);
        };
        ws.onerror = (e) => console.log("Error", e);
        ws.onmessage = (e) => {
            console.log("Message", e.data);
            this.receiveRawData(e.data as string);
        };

        this.webSocket = ws;
    }

    stop() {
        if (!this.webSocket) return;
        this.webSocket.close(200, "Close communication");
        this.webSocket = null;
    }

    override sendRawData(rawData: string): void {
        this.webSocket?.send(rawData);
    }

}