import CommunicationCore, { CommunicationReceiver } from "./CommunicationCore";


export default class WindowSideWorkerCommunicationCore implements CommunicationCore {

    protected receiver!: CommunicationReceiver;

    constructor(
        protected readonly worker: Worker,
    ) { 
        worker.addEventListener("message", (event) => {
            this.receiver.receive(event.data);
        });
    }

    send(data: any): void {
        this.worker.postMessage(data);
    }

    bind(receiver: CommunicationReceiver): void {
        this.receiver = receiver;
    }

}
