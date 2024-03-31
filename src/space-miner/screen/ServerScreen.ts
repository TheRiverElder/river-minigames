import { int } from "../../libs/CommonTypes";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import Game from "../model/global/Game";
import Profile from "../model/global/Profile";
import { CreativeType } from "../model/io/CreativeType";
import { GameRuntime } from "../worker/main";

export default interface ServerScreen {

    readonly type: ServerScreenType;
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

export type ServerScreenType<T extends ServerScreen = ServerScreen, TPayload = void> = CreativeType<T, GameRuntime, ServerScreenTypeData<TPayload>>;

export interface ServerScreenTypeData<TPayload> {
    readonly profile: Profile;
    readonly payload: TPayload;
    readonly [key: string]: any;
}