import { int } from "../../libs/CommonTypes";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import Profile from "../model/global/Profile";
import { CreativeType } from "../model/io/CreativeType";
import { GameRuntime } from "../worker/main";

export default interface ServerScreen {

    readonly type: ScreenType;
    readonly uid: int;

    get runtime(): GameRuntime;
    get profile(): Profile;

    send(pack: CommandPack): void;
    receive(pack: CommandPack): void;

    open(): void;
    setup(): void;
    dispose(): void;
    close(): void;
}

export type ScreenType<T extends ServerScreen = ServerScreen> = CreativeType<T>;