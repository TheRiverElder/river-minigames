import { int } from "../../../libs/CommonTypes";
import { Channel } from "./Channel";

export interface ChannelDataSender<TChannel extends Channel> {

    sendPushPack(channel: TChannel, command: string, data?: any): void;
    sendGetPack(channel: TChannel, id: int, command: string, data?: any): void;
}