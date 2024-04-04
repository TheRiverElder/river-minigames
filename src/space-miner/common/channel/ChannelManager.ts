import { int } from "../../../libs/CommonTypes";
import Registry from "../../../libs/management/Registry";
import { ChannelDataSender } from "./ChannelDataSender";
import CommunicationCore from "./CommunicationCore";
import { CommunicationReceiver } from "./CommunicationCore";
import NamedChannelBase from "./NamedChannelBase";


export default class ChannelManager implements CommunicationReceiver, ChannelDataSender<NamedChannelBase> {

    public readonly TYPE_DATA = "data";
    public readonly TYPE_REQUEST = "request";
    public readonly TYPE_RESPONSE = "response";
    public readonly TYPE_RESPONSE_ERROR = "response_error";

    public readonly channels = new Registry<string, NamedChannelBase>(it => it.name);

    constructor(
        protected readonly core: CommunicationCore,
    ) {
        core.bind(this);
    }

    public sendData(channel: NamedChannelBase, command: string, data?: any) {
        const pack: ChannelBasePack = {
            type: this.TYPE_DATA,
            channel: channel.name,
            command,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    public sendRequest(channel: NamedChannelBase, id: int, command: string, data?: any) {
        const pack: ChannelBasePack = {
            type: this.TYPE_REQUEST,
            channel: channel.name,
            command,
            id,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    private sendResponse(channel: NamedChannelBase, id: int, data?: any) {
        const pack: ChannelBasePack = {
            type: this.TYPE_RESPONSE,
            channel: channel.name,
            id,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    private sendResponseError(channel: NamedChannelBase, id: int, error: unknown) {
        const pack: ChannelBasePack = {
            type: this.TYPE_RESPONSE_ERROR,
            channel: channel.name,
            id,
            data: error,
        };

        this.core.send(pack);
    }

    public receive(pack: ChannelBasePack): void {
        const { type, channel: channelname, command, id, data } = pack;
        const channel = this.channels.getOrThrow(channelname);

        switch (type) {
            case "data": {
                if (typeof command !== 'string') throw new Error("Command must be string.");
                channel.receive(command!, data);
            } break;
            case "request": {
                if (typeof command !== 'string' || typeof id !== 'number') throw new Error("Command must be string, id must be number.");
                try {
                    const responseData = channel.response(command, data);
                    this.sendResponse(channel, id, responseData);
                } catch (error) {
                    this.sendResponseError(channel, id, error);
                }
            } break;
            case "response": {
                if (typeof id !== 'number') throw new Error("Id must be number.");
                channel.receiveResponse(id, data);
            } break;
            case "response_error": {
                if (typeof id !== 'number') throw new Error("Id must be number.");
                channel.receiveResponseError(id, data);
            } break;
            default: {
                throw new Error(`Unknown type: ${type}.`);
            }
        }
    }

}

export interface ChannelBasePack {
    type: "data" | "request" | "response" | "response_error";
    channel: string;
    command?: string;
    id?: int;
    data?: any;
}