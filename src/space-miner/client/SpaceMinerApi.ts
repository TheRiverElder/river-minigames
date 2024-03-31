import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import SpaceMinerChannelManager from "../common/SpaceMinerChannelManager";
import { OrbModel } from "../model/orb/Orb";
import ClientScreen, { ClientScreenType } from "../screen/ClientScreen";
import GameActionChannel from "./channel/GameActionChannel";
import GameControlChannel from "./channel/GameControlChannel";
import GameQueryChannel from "./channel/GameQueryChannel";
import GameUpdateChannel from "./channel/GameUpdateChannel";
import RegistryChannel from "./channel/RegistryChannel";
import SpaceMinerChannel from "./channel/SpaceMinerChannel";
import UiChannel from "./channel/UiChannel";

export default interface SpaceMinerApi {

    get channelManager(): SpaceMinerChannelManager<SpaceMinerChannel>;

    get channelGameControl(): GameControlChannel;
    get channelGameUpdate(): GameUpdateChannel;
    get channelGameQuery(): GameQueryChannel;
    get channelGameAction(): GameActionChannel;
    get channelUi(): UiChannel;
    get channelRegistry(): RegistryChannel;
    
    readonly screenTypes: Registry<string, ClientScreenType>;
    readonly screens: Registry<int, ClientScreen>;

    getOrbDetail(): Promise<OrbModel>;

    start(): void;
    stop(): void;
}
