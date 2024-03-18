import { OrbModel } from "../model/orb/Orb";
import SpaceMinerApi from "./SpaceMinerApi";
import GameUpdateChannel from "./channel/GameUpdateChannel";
import MessageChannel from "./channel/UiChannel";
import SpaceMinerChannelManager from "../common/SpaceMinerChannelManager";
import RegistryChannel from "./channel/RegistryChannel";
import GameControlChannel from "./channel/GameControlChannel";
import GameQueryChannel from "./channel/GameQueryChannel";

export default class SimpleSpaceMinerApi implements SpaceMinerApi {

    readonly channelManager;
    readonly channelGameControl;
    readonly channelGameUpdate;
    readonly channelGameQuery;
    readonly channelUi;
    readonly channelRegistry;

    constructor(
        public readonly worker: Worker,
    ) {

        this.channelManager = new SpaceMinerChannelManager(this.worker);
        this.channelGameControl = new GameControlChannel(this.channelManager);
        this.channelGameUpdate = new GameUpdateChannel(this.channelManager);
        this.channelGameQuery = new GameQueryChannel(this.channelManager);
        this.channelUi = new MessageChannel(this.channelManager);
        this.channelRegistry = new RegistryChannel(this.channelManager);

        this.channelManager.channels.add(this.channelGameControl);
        this.channelManager.channels.add(this.channelGameUpdate);
        this.channelManager.channels.add(this.channelGameQuery);
        this.channelManager.channels.add(this.channelUi);
        this.channelManager.channels.add(this.channelRegistry);
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