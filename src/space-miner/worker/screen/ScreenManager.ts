import { Consumer, int } from "../../../libs/CommonTypes";
import ObservableRegistry from "../../../libs/management/ObservableRegistry";
import Registry from "../../../libs/management/Registry";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import ScreenChannel from "../../common/screen/ScreenChannel";
import { GameRuntime } from "../main";
import ServerScreen, { ServerScreenType } from "./ServerScreen";

export default class ScreenManager {

    protected readonly screenUidGenerator = new IncrementNumberGenerator(1);

    readonly screenTypes = new Registry<string, ServerScreenType<ServerScreen, any>>(it => it.id);
    readonly screens = new ObservableRegistry<int, ServerScreen>(it => it.uid);
    readonly callbacks = new Registry<int, ScreenCallback>(it => it.uid);

    constructor() {
        this.screens.onRemoveListeners.add(this.onScreenRemoved);
    }

    private onScreenRemoved = (screen: ServerScreen) => {
        this.callbacks.take(screen.uid).ifPresent(callback => callback.reject(new Error("No response.")));
    };

    open(type: ServerScreenType, runtime: GameRuntime, payload?: any): ServerScreen {
        const uid = runtime.screenManager.screenUidGenerator.generate();
        const channel = new ScreenChannel(runtime.channels.GAME_UI, uid);
        const screen = type.create(runtime, { uid, profile: runtime.game.profile, channel, payload });
        screen.open();

        return screen;
    }

    openByTypeId(typeId: string, runtime: GameRuntime, payload?: any): ServerScreen {
        return this.open(this.screenTypes.getOrThrow(typeId), runtime, payload);
    }

    openDialog<TReturn = any>(screen: ServerScreen): Promise<TReturn> {
        const promise = new Promise<TReturn>((resolve, reject) => {

            const callback: ScreenCallback<TReturn> = {
                uid: screen.uid,
                promise,
                resolve,
                reject,
            };

            this.callbacks.add(callback);
        });

        return promise;
    }

    resolveDialogResult<TReturn = any>(uid: int, data: TReturn) {
        this.callbacks.take(uid).ifPresent(callback => callback.resolve(data));
    }

    rejectDialogResult(uid: int, reason?: any) {
        this.callbacks.take(uid).ifPresent(callback => callback.reject(reason));
    }




}

export interface ScreenCallback<TReturn = any> {
    readonly uid: int;
    readonly promise: Promise<TReturn>;
    readonly resolve: Consumer<TReturn>;
    readonly reject: Consumer<any>;
}
