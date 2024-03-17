import Channel from "./Channel";

export default abstract class ChannelAdaptor<TSend, TReceive, TRaw> implements Channel<TSend, TReceive> {

    abstract createRawData(data: TSend): TRaw;
    abstract sendRawData(raw: TRaw): void;
    abstract receiveRawData(raw: TRaw): void;

    send(data: TSend): void {
        const raw = this.createRawData(data);
        this.sendRawData(raw);
    }
    
    abstract receive(data: TReceive): void;

}