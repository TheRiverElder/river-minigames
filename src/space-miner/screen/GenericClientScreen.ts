import { ComponentType } from "react";
import { int } from "../../libs/CommonTypes";
import SpaceMinerApi from "../client/SpaceMinerApi";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../ui/common";
import ClientScreen, { ClientScreenType } from "./ClientScreen";

export default abstract class GenericClientScreen implements ClientScreen {

    get gameApi(): SpaceMinerApi {
        return this.props.gameApi;
    }

    
    constructor(
        public readonly type: ClientScreenType,
        public readonly props: SpaceMinerGameClientCommonProps,
        public readonly uid: int,
    ) { }

    send(pack: CommandPack<any>): void {
        this.gameApi.channelUi.sendSignalScreenUpdate(this.uid, pack);
    }

    abstract getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;

    abstract receive(pack: CommandPack<any>): void;

    open(): void {
        this.gameApi.screens.add(this);
        this.setup();
    }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.dispose();
        this.gameApi.channelUi.sendSignalScreenClose(this.uid);
    }

}