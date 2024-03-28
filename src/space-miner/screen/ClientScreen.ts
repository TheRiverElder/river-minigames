import { int } from "../../libs/CommonTypes";
import SpaceMinerApi from "../client/SpaceMinerApi";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import { CreativeType } from "../model/io/CreativeType";

export default interface ClientScreen {

    readonly type: ScreenType;
    readonly uid: int;

    get gameApi(): SpaceMinerApi;

    send(pack: CommandPack): void;
    receive(pack: CommandPack): void;

    setup(): void;
    dispose(): void;
    close(): void;
}

export type ScreenType<T extends ClientScreen = ClientScreen> = CreativeType<T>;