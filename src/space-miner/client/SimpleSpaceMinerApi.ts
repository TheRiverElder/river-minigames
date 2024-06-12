import { OrbModel } from "../model/orb/Orb";
import SpaceMinerApi from "./SpaceMinerApi";
import GameUpdateClientChannel from "./channel/GameUpdateClientChannel";
import MessageChannel from "./channel/UiClientChannel";
import RegistryClientChannel from "./channel/RegistryClientChannel";
import GameControlClientChannel from "./channel/GameControlClientChannel";
import GameQueryClientChannel from "./channel/GameQueryClientChannel";
import GameActionClientChannel from "./channel/GameActionClientChannel";
import { Supplier, int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import UiClientChannel from "./channel/UiClientChannel";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import { AssemblerClientScreen } from "./screen/AssemblerClientScreen";
import { SpaceMinerGameClientCommonProps } from "../ui/common";
import ChannelManager from "../common/channel/ChannelManager";
import WindowSideWorkerCommunicationCore from "../common/channel/WindowSideWorkerCommunicationCore";
import ClientChannel from "./channel/ClientChannel";
import ContractDraftClientScreen from "./screen/ContractDraftClientScreen";
import ContractsClientScreen from "./screen/ContractsClientScreen";
import ClientScreen, { ClientScreenType } from "./screen/ClientScreen";

export default class SimpleSpaceMinerApi implements SpaceMinerApi {

    readonly channelManager;

    readonly channelGameControl: GameControlClientChannel;
    readonly channelGameUpdate: GameUpdateClientChannel;
    readonly channelGameQuery: GameQueryClientChannel;
    readonly channelGameAction: GameActionClientChannel;
    readonly channelUi: UiClientChannel;
    readonly channelRegistry: RegistryClientChannel;

    readonly screenTypes = new Registry<string, ClientScreenType>(it => it.id);
    readonly screens = new ObservableRegistry<int, ClientScreen>(it => it.uid);

    public propsSupplier!: Supplier<SpaceMinerGameClientCommonProps>;

    constructor(
        public readonly worker: Worker,
    ) {

        this.channelManager = new ChannelManager(new WindowSideWorkerCommunicationCore(this.worker));

        this.channelGameControl = this.addChannel(new GameControlClientChannel(this.channelManager, this));
        this.channelGameUpdate = this.addChannel(new GameUpdateClientChannel(this.channelManager, this));
        this.channelGameQuery = this.addChannel(new GameQueryClientChannel(this.channelManager, this));
        this.channelGameAction = this.addChannel(new GameActionClientChannel(this.channelManager, this));
        this.channelUi = this.addChannel(new MessageChannel(this.channelManager, this));
        this.channelRegistry = this.addChannel(new RegistryClientChannel(this.channelManager, this));

        this.screenTypes.add(AssemblerClientScreen.TYPE);
        this.screenTypes.add(ContractDraftClientScreen.TYPE);
        this.screenTypes.add(ContractsClientScreen.TYPE);
    }

    private addChannel<T extends ClientChannel>(channel: T): T {
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