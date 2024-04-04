import { ComponentType } from "react";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { SpaceMinerGameClientCommonProps, SpaceMinerClientCommonProps } from "../../ui/common";
import SpaceMinerApi from "../SpaceMinerApi";
import ScreenChannel from "../../common/screen/ScreenChannel";

export default interface ClientScreen {

    readonly type: ClientScreenType;
    readonly uid: int;

    get gameApi(): SpaceMinerApi;
    get props(): SpaceMinerGameClientCommonProps;

    get channel(): ScreenChannel;

    open(): void;
    setup(): void;
    dispose(): void;
    close(): void;

    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;
}

export type ClientScreenType<T extends ClientScreen = ClientScreen, TPayload = void> = CreativeType<T, SpaceMinerApi, ClientScreenTypeData>;

export interface ClientScreenTypeData {
    readonly channel: ScreenChannel;
    readonly uid: int;
    readonly props: SpaceMinerGameClientCommonProps;
    readonly [T: string]: any;
}