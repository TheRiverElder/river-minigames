import { Pair, int } from "../../../libs/CommonTypes";
import ListenerManager from "../../../libs/management/ListenerManager";
import { Channel } from "../channel/Channel";
import ChannelBase from "../channel/ChannelBase";
import { ChannelDataSender } from "../channel/ChannelDataSender";

export default class ScreenChannel extends ChannelBase {

    constructor(
        sender: ChannelDataSender<Channel>,
        public readonly screenUid: int,
    ) {
        super(sender);
    }

    public readonly listeners = {
        RECEIVE: new ListenerManager<Pair<string, any>>(),
        RESPONSE: new ListenerManager<Pair<string, any>, any>(),
    };

    override receive(command: string, data?: any): void {
        this.listeners.RECEIVE.emit([command, data]);
    }

    override response(command: string, data?: any): any {
        return this.listeners.RESPONSE.emit([command, data]);
    }
}