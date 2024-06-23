import { ComponentType } from "react";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { SpaceMinerGameClientCommonProps, SpaceMinerClientCommonProps } from "../../ui/common";
import SpaceMinerApi from "../SpaceMinerApi";
import ScreenChannel from "../../common/screen/ScreenChannel";
import GameScreen from "../../common/screen/GameScreen";

export default interface ClientScreen extends GameScreen {

    readonly type: ClientScreenType;

    get gameApi(): SpaceMinerApi;
    get props(): SpaceMinerGameClientCommonProps;

    open(): void;
    setup(): void;
    dispose(): void;
    close(): void;

    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;
}

export type ClientScreenType<T extends ClientScreen = ClientScreen, TPayload = any> = CreativeType<T, SpaceMinerApi, ClientScreenTypeData<TPayload>>;

export interface ClientScreenTypeData<TPayload> {
    readonly channel: ScreenChannel;
    readonly uid: int;
    readonly props: SpaceMinerGameClientCommonProps;
    readonly payload: TPayload;
    readonly [T: string]: any;
}