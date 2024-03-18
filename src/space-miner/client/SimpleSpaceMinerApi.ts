import { OrbModel } from "../model/orb/Orb";
import SpaceMinerApi from "./SpaceMinerApi";
import GameUpdateChannel from "./channel/GameUpdateChannel";
import MessageChannel from "./channel/UiChannel";
import SpaceMinerChannelManager from "../common/SpaceMinerChannelManager";
import RegistryChannel from "./channel/RegistryChannel";
import GameControlChannel from "./channel/GameControlChannel";
import GameQueryChannel from "./channel/GameQueryChannel";
import SpaceMinerChannel from "./channel/SpaceMinerChannel";
import GameActionChannel from "./channel/GameActionChannel";

export default class SimpleSpaceMinerApi implements SpaceMinerApi {

    readonly channelManager;

    readonly channelGameControl;
    readonly channelGameUpdate;
    readonly channelGameQuery;
    readonly channelGameAction;
    readonly channelUi;
    readonly channelRegistry;

    constructor(
        public readonly worker: Worker,
    ) {

        this.channelManager = new SpaceMinerChannelManager<SpaceMinerChannel>(this.worker);

        this.channelGameControl = this.addChannel(new GameControlChannel(this.channelManager));
        this.channelGameUpdate = this.addChannel(new GameUpdateChannel(this.channelManager));
        this.channelGameQuery = this.addChannel(new GameQueryChannel(this.channelManager));
        this.channelGameAction = this.addChannel(new GameActionChannel(this.channelManager));
        this.channelUi = this.addChannel(new MessageChannel(this.channelManager));
        this.channelRegistry = this.addChannel(new RegistryChannel(this.channelManager));
    }

    private addChannel<T extends SpaceMinerChannel>(channel: T): T {
        this.channelManager.channels.add(channel);
        return channel;
    }

    start(): void {
        this.channelGameControl.sendSignalStart();
    }

    stop(): void {
        this.channelGameControl.sendSignalStop();
        this.worker.terminate();
    }

    getOrbDetail(): Promise<OrbModel> {
        throw new Error("Method not implemented.");
    }

}