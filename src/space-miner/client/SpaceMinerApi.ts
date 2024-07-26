import { int } from "../../libs/CommonTypes";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import Registry from "../../libs/management/Registry";
import ChannelManager from "../common/channel/ChannelManager";
import { OrbModel } from "../model/orb/Orb";
import GameActionClientChannel from "./channel/GameActionClientChannel";
import GameControlClientChannel from "./channel/GameControlClientChannel";
import GameQueryClientChannel from "./channel/GameQueryClientChannel";
import GameUpdateClientChannel from "./channel/GameUpdateClientChannel";
import RegistryClientChannel from "./channel/RegistryClientChannel";
import UiClientChannel from "./channel/UiClientChannel";
import ClientScreen, { ClientScreenType } from "./screen/ClientScreen";

export default interface SpaceMinerApi {

    get channelManager(): ChannelManager;

    get channelGameControl(): GameControlClientChannel;
    get channelGameUpdate(): GameUpdateClientChannel;
    get channelGameQuery(): GameQueryClientChannel;
    get channelGameAction(): GameActionClientChannel;
    get channelUi(): UiClientChannel;
    get channelRegistry(): RegistryClientChannel;
    
    readonly screenTypes: Registry<string, ClientScreenType>;
    readonly screens: ObservableRegistry<int, ClientScreen>;

    start(): void;
    stop(): void;
}
