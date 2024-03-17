import ChannelAdaptor from "./ChannelAdaptor";

export default abstract class JsonChannelAdaptor<TSend, TReceive> extends ChannelAdaptor<TSend, TReceive, string> {

    createRawData(data: TSend): string {
        return JSON.stringify(data);
    }

    receiveRawData(raw: string): void {
        const data: TReceive = JSON.parse(raw);
        this.receive(data);
    }
    

}