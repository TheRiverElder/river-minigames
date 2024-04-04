import { int } from "../../libs/CommonTypes";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import Profile from "../model/global/Profile";
import { GameRuntime } from "../worker/main";
import ServerScreen, { ServerScreenType } from "./ServerScreen";

export default abstract class GenericServerScreen implements ServerScreen {

    public readonly uid: int;

    constructor(
        public readonly type: ServerScreenType,
        public readonly runtime: GameRuntime,
        public readonly profile: Profile,
    ) {
        this.uid = runtime.screenUidGenerator.generate();
    }

    send(pack: CommandPack<any>): void {
        this.runtime.channels.GAME_UI.sendScreenUpdate(this.uid, pack);
    }

    abstract receive(pack: CommandPack<any>): void;

    open(): void {
        this.runtime.screens.add(this);
        this.runtime.channels.GAME_UI.notifyScreenOpen(this.type.id, this.uid, this.getOpenPayLoad());
        this.setup();
    }

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