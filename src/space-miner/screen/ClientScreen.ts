import { ComponentType } from "react";
import { int } from "../../libs/CommonTypes";
import SpaceMinerApi from "../client/SpaceMinerApi";
import { CommandPack } from "../client/channel/SpaceMinerChannel";
import { CreativeType } from "../model/io/CreativeType";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../ui/common";

export default interface ClientScreen {

    readonly type: ClientScreenType;
    readonly uid: int;

    get gameApi(): SpaceMinerApi;
    get props(): SpaceMinerGameClientCommonProps;

    send(pack: CommandPack): void;
    receive(pack: CommandPack): void;

    open(): void;
    setup(): void;
    dispose(): void;
    close(): void;

    getComponentProvider(): ComponentType<SpaceMinerClientCommonProps>;
}

export type ClientScreenType<T extends ClientScreen = ClientScreen, TPayload = void> = CreativeType<T, SpaceMinerApi, ClientScreenTypeData>;

export interface ClientScreenTypeData {
    readonly uid: int;
    readonly props: SpaceMinerGameClientCommonProps;
    readonly [T: string]: any;
}