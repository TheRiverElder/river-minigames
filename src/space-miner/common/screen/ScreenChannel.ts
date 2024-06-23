import { int } from "../../../libs/CommonTypes";
import { Channel } from "../channel/Channel";
import ChannelBase from "../channel/ChannelBase";
import { ChannelDataSender } from "../channel/ChannelDataSender";
import GameScreen from "./GameScreen";

export default class ScreenChannel extends ChannelBase {

    protected receiver!: GameScreen;

    constructor(
        sender: ChannelDataSender<Channel>,
        public readonly screenUid: int,
    ) {
        super(sender);
    }

    bind(receiver: GameScreen) {
        this.receiver = receiver;
    }

    override receive(command: string, data?: any): any {
        return this.receiver.receive(command, data);
    }
}