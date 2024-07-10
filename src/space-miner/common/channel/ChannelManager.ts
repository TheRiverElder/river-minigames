import { int } from "../../../libs/CommonTypes";
import Registry from "../../../libs/management/Registry";
import { ChannelDataSender } from "./ChannelDataSender";
import CommunicationCore from "./CommunicationCore";
import { CommunicationReceiver } from "./CommunicationCore";
import NamedChannelBase from "./NamedChannelBase";


export default class ChannelManager implements CommunicationReceiver, ChannelDataSender<NamedChannelBase> {

    public static readonly TYPE_PUSH: ChannelBasePackType = "push";
    public static readonly TYPE_GET: ChannelBasePackType = "get";
    public static readonly TYPE_RESPONSE: ChannelBasePackType = "response";
    public static readonly TYPE_RESPONSE_ERROR: ChannelBasePackType = "response_error";

    public readonly channels = new Registry<string, NamedChannelBase>(it => it.name);

    constructor(
        protected readonly core: CommunicationCore,
    ) {
        core.bind(this);
    }

    public sendPushPack(channel: NamedChannelBase, command: string, data?: any) {
        const pack: ChannelBasePack = {
            type: ChannelManager.TYPE_PUSH,
            channel: channel.name,
            command,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    public sendGetPack(channel: NamedChannelBase, id: int, command: string, data?: any) {
        const pack: ChannelBasePack = {
            type: ChannelManager.TYPE_GET,
            channel: channel.name,
            command,
            id,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    private sendResponsePack(channel: NamedChannelBase, id: int, data?: any) {
        const pack: ChannelBasePack = {
            type: ChannelManager.TYPE_RESPONSE,
            channel: channel.name,
            id,
            data: data ?? undefined,
        };

        this.core.send(pack);
    }

    private sendResponseError(channel: NamedChannelBase, id: int, error: unknown) {
        const pack: ChannelBasePack = {
            type: ChannelManager.TYPE_RESPONSE,
            channel: channel.name,
            id,
            error,
        };

        this.core.send(pack);
    }

    public receive(pack: ChannelBasePack): void {
        const { type, channel: channelname, command, id, data, error } = pack;
        const channel = this.channels.getOrThrow(channelname);

        switch (type) {
            case ChannelManager.TYPE_PUSH: {
                if (typeof command !== 'string') throw new Error("Command must be string.");

                channel.receive(command!, data);
            } break;
            case ChannelManager.TYPE_GET: {
                if (typeof command !== 'string' || typeof id !== 'number') 
                    throw new Error("Command must be string, id must be number.");

                try {
                    const responseData = channel.receive(command, data);
                    this.sendResponsePack(channel, id, responseData);
                } catch (error) {
                    this.sendResponseError(channel, id, error);
                }
            } break;
            case ChannelManager.TYPE_RESPONSE: {
                if (typeof id !== 'number') throw new Error("Id must be number.");

                channel.onResponse(id, data);
            } break;
            case ChannelManager.TYPE_RESPONSE_ERROR: {
                if (typeof id !== 'number') throw new Error("Id must be number.");
                channel.onResponseError(id, error);
            } break;
            default: {
                throw new Error(`Unknown type: ${type}.`);
            }
        }
    }

}

export type ChannelBasePackType = "push" | "get" | "response" | "response_error";

export interface ChannelBasePack {
    type: ChannelBasePackType;
    channel: string;
    command?: string;
    id?: int;
    data?: any;
    error?: any;
}