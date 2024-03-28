import { int } from "../../libs/CommonTypes";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import Profile from "../model/global/Profile";
import { GameRuntime } from "../worker/main";
import ServerScreen, { ScreenType } from "./ServerScreen";

export default abstract class GenericServerScreen implements ServerScreen {

    public readonly uid: int;

    constructor(
        public readonly type: ScreenType,
        public readonly runtime: GameRuntime,
        public readonly profile: Profile,
    ) {
        this.uid = runtime.screenUidGenerator.generate();
    }

    send(pack: CommandPack<any>): void {
        this.runtime.channels.GAME_UI.sendSignalScreenUpdate(this.uid, pack);
    }

    abstract receive(pack: CommandPack<any>): void;

    open(): void {
        this.runtime.screens.add(this);
        this.runtime.channels.GAME_UI.sendSignalScreenOpen(this.type.id, this.uid);
    }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.runtime.screens.remove(this);
        this.runtime.channels.GAME_UI.sendSignalScreenClose(this.uid);
    }

}