import { int } from "../../../libs/CommonTypes";
import { Channel } from "./Channel";

export interface ChannelDataSender<TChannel extends Channel> {

    sendData(channel: TChannel, command: string, data?: any): void;
    sendRequest(channel: TChannel, id: int, command: string, data?: any): void;
}