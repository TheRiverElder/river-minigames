// import { int } from "../../libs/CommonTypes";
// import Channel from "../../libs/io/channel/Channel";
// import Registry from "../../libs/management/Registry";

// export default class SpaceMinerChannelManager<TChannel extends Channel & { name: string; response(id: int, data: any): void; }> implements Channel<ChannelMainPack, ChannelMainPack> {

//     public readonly mainObject;
//     public readonly channels = new Registry<string, TChannel>(it => it.name);

//     constructor(
//         public readonly worker?: Worker,
//     ) {
//         this.mainObject = this.worker ?? self;
//         this.mainObject.addEventListener("message", (event) => this.receive((event as MessageEvent).data));
//     }

//     send(pack: ChannelMainPack): void {
//         this.mainObject.postMessage(pack);
//     }

//     receive(pack: ChannelMainPack): void {
//         const { channel : channelName, id, data } = pack;
//         const channel = this.channels.getOrThrow(channelName);

//         if (typeof id === 'number') {
//             channel.response(id, data);
//         } else {
//             channel.receive(data);
//         }
//     }

// }

// export interface ChannelMainPack<T = any> {
//     readonly channel: string;
//     readonly id?: number;
//     readonly data: T;
// }