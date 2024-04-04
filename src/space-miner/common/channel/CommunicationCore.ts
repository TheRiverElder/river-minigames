
export default interface CommunicationCore {
    send(data: any): void;
    bind(receiver: CommunicationReceiver): void;
}

export interface CommunicationReceiver {
    receive(data: any): void;
}