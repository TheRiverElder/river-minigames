import JsonChannelAdaptor from "./JsonChannelAdaptor";

export default abstract class WorkerJsonChannelAdaptor<TSend, TReceive> extends JsonChannelAdaptor<TSend, TReceive> {

    constructor(
        public readonly worker: Worker,
    ) {
        super();
        worker.addEventListener("message", event => this.receiveRawData(event.data));
    }


    sendRawData(raw: string): void {
        this.worker.postMessage(raw);
    }
}