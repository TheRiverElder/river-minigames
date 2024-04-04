import { ComponentType } from "react";
import { int } from "../../../libs/CommonTypes";
import SpaceMinerApi from "../SpaceMinerApi";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../../ui/common";
import ClientScreen, { ClientScreenType } from "./ClientScreen";
import ScreenChannel from "../../common/screen/ScreenChannel";

export default abstract class GenericClientScreen implements ClientScreen {

    get gameApi(): SpaceMinerApi {
        return this.props.gameApi;
    }


    constructor(
        public readonly type: ClientScreenType,
        public readonly props: SpaceMinerGameClientCommonProps,
        public readonly uid: int,
        public readonly channel: ScreenChannel,
    ) {
        channel.listeners.RECEIVE.add(it => this.receive(...it));
        channel.listeners.RESPONSE.add(it => this.response(...it));
    }

    abstract getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;

    open(): void {
        this.gameApi.screens.add(this);
        this.setup();
    }

    receive(command: string, data?: any): void { }
    response(command: string, data?: any): any { }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.dispose();
        this.gameApi.channelUi.sendScreenClose(this.uid);
    }

}