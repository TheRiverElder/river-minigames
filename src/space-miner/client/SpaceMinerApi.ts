import { OrbModel } from "../model/orb/Orb";
import GameControlChannel from "./channel/GameControlChannel";
import GameQueryChannel from "./channel/GameQueryChannel";
import GameUpdateChannel from "./channel/GameUpdateChannel";
import RegistryChannel from "./channel/RegistryChannel";
import UiChannel from "./channel/UiChannel";

export default interface SpaceMinerApi {

    get channelGameControl(): GameControlChannel;
    get channelGameUpdate(): GameUpdateChannel;
    get channelGameQuery(): GameQueryChannel;
    get channelUi(): UiChannel;
    get channelRegistry(): RegistryChannel;

    getOrbDetail(): Promise<OrbModel>;

    start(): void;
    stop(): void;
}
