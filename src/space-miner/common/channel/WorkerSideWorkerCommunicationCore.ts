import CommunicationCore, { CommunicationReceiver } from "./CommunicationCore";


export default class WorkerSideWorkerCommunicationCore implements CommunicationCore {

    protected receiver!: CommunicationReceiver;

    constructor() {
        self.addEventListener("message", (event) => {
            this.receiver.receive(event.data);
        });
    }

    send(data: any): void {
        self.postMessage(data);
    }

    bind(receiver: CommunicationReceiver): void {
        this.receiver = receiver;
    }
}