
import { int } from "../../../libs/CommonTypes";
import ScreenChannel from "../../common/screen/ScreenChannel";
import Profile from "../../model/global/Profile";
import { GameRuntime } from "../main";
import ServerScreen, { ServerScreenType } from "./ServerScreen";

export interface GenericServerScreenProps<T extends GenericServerScreen<T>, TPayload = void> {
    readonly type: ServerScreenType<T, TPayload>,
    readonly uid: int,
    readonly runtime: GameRuntime,
    readonly profile: Profile,
    readonly channel: ScreenChannel,
    readonly payload: TPayload,
}

export default abstract class GenericServerScreen<T extends GenericServerScreen<T>> implements ServerScreen {

    public readonly type: ServerScreenType;
    public readonly uid: int;
    public readonly runtime: GameRuntime;
    public readonly profile: Profile;
    public readonly channel: ScreenChannel;

    constructor(props: GenericServerScreenProps<T, any>) {
        this.type = props.type;
        this.uid = props.uid;
        this.runtime = props.runtime;
        this.profile = props.profile;
        this.channel = props.channel;

        this.channel.bind(this);
    }

    open(): void {
        this.runtime.screenManager.screens.add(this);
        this.runtime.channels.GAME_UI.notifyScreenOpen(this.type.id, this.uid, this.getOpenPayLoad());
        this.setup();
    }

    receive(command: string, data?: any): any {
        if (command === "update_client_ui_data") {
            return this.collectClientUiData();
        }
    }

    getOpenPayLoad(): any {
        return {};
    }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.dispose();
        this.runtime.screenManager.screens.remove(this);
        this.runtime.channels.GAME_UI.sendScreenClose(this.uid);
    }

    resolveDialogResult<TResult = any>(result: TResult) {
        this.runtime.screenManager.resolveDialogResult(this.uid, result);
    }

    rejectDialogResult(reason?: any) {
        this.runtime.screenManager.rejectDialogResult(this.uid, reason);
    }

    collectClientUiData(): any {
        return {};
    }

    updateClientUiData(data: any = this.collectClientUiData()) {
        this.channel.send("update_client_ui_data", data);
    }

}