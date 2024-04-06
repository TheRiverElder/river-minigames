
import { int } from "../../../libs/CommonTypes";
import ScreenChannel from "../../common/screen/ScreenChannel";
import Profile from "../../model/global/Profile";
import { GameRuntime } from "../main";
import ServerScreen, { ServerScreenType } from "./ServerScreen";

export interface GenericServerScreenProps {
    readonly type: ServerScreenType,
    readonly uid: int,
    readonly runtime: GameRuntime,
    readonly profile: Profile,
    readonly channel: ScreenChannel,
}

export default abstract class GenericServerScreen implements ServerScreen {

    public readonly type: ServerScreenType;
    public readonly uid: int;
    public readonly runtime: GameRuntime;
    public readonly profile: Profile;
    public readonly channel: ScreenChannel;

    constructor(props: GenericServerScreenProps) {
        this.type = props.type;
        this.uid = props.uid;
        this.runtime = props.runtime;
        this.profile = props.profile;
        this.channel = props.channel;

        this.channel.listeners.RECEIVE.add(it => this.receive(...it));
        this.channel.listeners.RESPONSE.add(it => this.response(...it));
    }

    open(): void {
        this.runtime.screens.add(this);
        this.runtime.channels.GAME_UI.notifyScreenOpen(this.type.id, this.uid, this.getOpenPayLoad());
        this.setup();
    }

    receive(command: string, data?: any): void { }
    response(command: string, data?: any): any { }

    getOpenPayLoad(): any {
        return {};
    }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.dispose();
        this.runtime.screens.remove(this);
        this.runtime.channels.GAME_UI.sendScreenClose(this.uid);
    }

}