import GameScreen from "../../common/screen/GameScreen";
import ScreenChannel from "../../common/screen/ScreenChannel";
import Profile from "../../model/global/Profile";
import { CreativeType } from "../../model/io/CreativeType";
import { GameRuntime } from "../main";

export default interface ServerScreen extends GameScreen {

    readonly type: ServerScreenType;

    get runtime(): GameRuntime;
    get profile(): Profile;

    open(): void;
    setup(): void;
    dispose(): void;
    close(): void;
}

export type ServerScreenType<T extends ServerScreen = ServerScreen, TPayload = void> = CreativeType<T, GameRuntime, ServerScreenTypeData<TPayload>>;

export interface ServerScreenTypeData<TPayload> {
    readonly channel: ScreenChannel;
    readonly profile: Profile;
    readonly payload: TPayload;
    readonly [key: string]: any;
}