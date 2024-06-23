import { ComponentType } from "react";
import { int } from "../../../libs/CommonTypes";
import SpaceMinerApi from "../SpaceMinerApi";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../../ui/common";
import ClientScreen, { ClientScreenType } from "./ClientScreen";
import ScreenChannel from "../../common/screen/ScreenChannel";

export interface GenericClientScreenProps<T extends GenericClientScreen<T>, TPayload = void> {
    readonly type: ClientScreenType<T, TPayload>;
    readonly props: SpaceMinerGameClientCommonProps;
    readonly uid: int;
    readonly channel: ScreenChannel;
    readonly payload: TPayload;
}

export default abstract class GenericClientScreen<T extends GenericClientScreen<T>> implements ClientScreen {

    get gameApi(): SpaceMinerApi {
        return this.props.gameApi;
    }
    
    public readonly type: ClientScreenType;
    public readonly props: SpaceMinerGameClientCommonProps;
    public readonly uid: int;
    public readonly channel: ScreenChannel;


    constructor(
        props: GenericClientScreenProps<T, any>,
    ) {
        this.type = props.type;
        this.props = props.props;
        this.uid = props.uid;
        this.channel = props.channel;

        this.channel.listeners.RECEIVE.add(it => this.receive(...it));
        this.channel.listeners.RESPONSE.add(it => this.response(...it));
    }

    abstract getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;

    open(): void {
        this.gameApi.screens.add(this);
        this.setup();
    }

    receive(command: string, data?: any): void { 
        this.response(command, data);
    }

    response(command: string, data?: any): any {
        if (command === "update_client_ui_data") {
            this.onUpdateClientUiData(data);
        }
    }

    setup(): void { }

    dispose(): void { }

    close(): void {
        this.dispose();
        this.gameApi.channelUi.sendScreenClose(this.uid);
    }


    onUpdateClientUiData(data?: any) {
        // To implement
    }

    updateUiData(): Promise<void> {
        return this.requestUiData().then(data => void this.onUpdateClientUiData(data));
    }

    requestUiData(): Promise<any> {
        return this.channel.request("update_client_ui_data");
    }
}