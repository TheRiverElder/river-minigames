

export default interface Channel<TSend = any, TReceive = any> {
    send(data: TSend): void;
    receive(data: TReceive): void;
}