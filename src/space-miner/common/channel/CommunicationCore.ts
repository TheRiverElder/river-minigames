
export default interface CommunicationCore<TSendData = any, TReceiveData = any> {
    send(data: TSendData): void;
    bind(receiver: CommunicationReceiver<TReceiveData>): void;
}

export interface CommunicationReceiver<TData = any> {
    receive(data: TData): void;
}