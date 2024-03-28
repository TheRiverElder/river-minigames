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
import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import ClientScreen, { ScreenType } from "../screen/ClientScreen";
import UiChannel from "./channel/UiChannel";

export default class SimpleSpaceMinerApi implements SpaceMinerApi {

    readonly channelManager;

    readonly channelGameControl: GameControlChannel;
    readonly channelGameUpdate: GameUpdateChannel;
    readonly channelGameQuery: GameQueryChannel;
    readonly channelGameAction: GameActionChannel;
    readonly channelUi: UiChannel;
    readonly channelRegistry: RegistryChannel;

    readonly screenTypes = new Registry<string, ScreenType>(it => it.id);
    readonly screens = new Registry<int, ClientScreen>(it => it.uid);

    constructor(
        public readonly worker: Worker,
    ) {

        this.channelManager = new SpaceMinerChannelManager<SpaceMinerChannel>(this.worker);

        this.channelGameControl = this.addChannel(new GameControlChannel(this));
        this.channelGameUpdate = this.addChannel(new GameUpdateChannel(this));
        this.channelGameQuery = this.addChannel(new GameQueryChannel(this));
        this.channelGameAction = this.addChannel(new GameActionChannel(this));
        this.channelUi = this.addChannel(new MessageChannel(this));
        this.channelRegistry = this.addChannel(new RegistryChannel(this));
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