import { int } from "../../libs/CommonTypes";
import SpaceMinerApi from "../client/SpaceMinerApi";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import ClientScreen, { ScreenType } from "./ClientScreen";

export default abstract class GenericClientScreen implements ClientScreen {

    
    constructor(
        public readonly type: ScreenType,
        public readonly gameApi: SpaceMinerApi,
        public readonly uid: int,
    ) {
    }

    send(pack: CommandPack<any>): void {
        this.gameApi.channelUi.sendSignalScreenUpdate(this.uid, pack);
    }

    abstract receive(pack: CommandPack<any>): void;

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.gameApi.channelUi.sendSignalScreenClose(this.uid);
    }

}