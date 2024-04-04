import { ComponentType, ReactNode } from "react";
import { Consumer, double, Productor } from "../../libs/CommonTypes";
import I18n from "../../libs/i18n/I18n";
import Text from "../../libs/i18n/Text";
import { DialogContentProps } from "./frame/SimpleDialogWrapper";
import SpaceMinerApi from "../client/SpaceMinerApi";
import ClientScreen from "../screen/ClientScreen";

export interface SpaceMinerClientCommonProps {
    i18n: I18n;
    uiController: SpaceMinerUIController;
}

export interface SpaceMinerGameClientCommonProps extends SpaceMinerClientCommonProps {
    gameApi: SpaceMinerApi;
    resources: Map<string, string>;
}

export interface SpaceMinerUIController {
    openTab(tab: SpaceMinerClientTab): void;
    closeTab(): void;

    openDialog<T>(dialog: SpaceMinerClientDialog<T>): Promise<T>;
    openDialogDetail<T>(dialog: SpaceMinerClientDialog<T>): DialogDetail<T>;
    closeDialog(): void;

    startGame(gameApi: SpaceMinerApi): void;
    endGame(): void;

    displayMessage(text: Text | string): void;
}

export interface DialogDetail<T> {
    readonly promise: Promise<T>;
    readonly resolve: Consumer<T>;
    readonly reject: (error?: Error) => void;
};

export interface SpaceMinerGameRuleController {
    getTimeSpeed(): double;
    setTimeSpeed(value: double): void;
}

export interface SpaceMinerClientTab {
    title: Text;
    contentProvider: ComponentType<SpaceMinerClientCommonProps>;
    screen?: ClientScreen;
    // contentProvider: typeof Component<SpaceMinerClientCommonProps & { payload: TPayload }>;
    // payload: TPayload;
}

export interface SpaceMinerClientDialog<T = never> {
    initialValue?: T;
    renderContent: Productor<DialogContentProps<T>, ReactNode>;
    confirmable?: boolean; // 显示确认按钮
    cancelable?: boolean; // 显示取消按钮，它会默认blurable = true
    blurable?: boolean; // 允许点击背景遮罩的时候取消
}

export function purifyGameCommonProps(props: SpaceMinerGameClientCommonProps): SpaceMinerGameClientCommonProps {
    return {
        i18n: props.i18n,
        gameApi: props.gameApi,
        resources: props.resources,
        uiController: props.uiController,
    };
}

export function purifyCommonProps(props: SpaceMinerClientCommonProps): SpaceMinerClientCommonProps {
    return {
        i18n: props.i18n,
        uiController: props.uiController,
    };
}