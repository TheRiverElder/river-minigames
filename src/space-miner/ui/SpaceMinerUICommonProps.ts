import { ReactNode } from "react";
import { double, Productor } from "../../libs/CommonTypes";
import I18n from "../../libs/i18n/I18n";
import Text from "../../libs/i18n/Text";
import Game from "../Game";
import { DialogContentProps } from "./common/DialogOverlay";

export default interface SpaceMinerUICommonProps {
    i18n: I18n;
    game: Game;
    client: SpaceMinerClient;
    resources: Map<string, string>;
}

export interface SpaceMinerUIController {
    openTab(tab: SpaceMinerClientTab): void;
    closeTab(): void;

    openDialog<T>(dialog: SpaceMinerClientDialog<T>): Promise<T>;
    closeDialog(): void;
}

export interface SpaceMinerClient extends SpaceMinerUIController {
    getTimeSpeed(): double;
    setTimeSpeed(value: double): void;
}

export interface SpaceMinerClientTab {
    title: Text;
    content: ReactNode;
}

export interface SpaceMinerClientDialog<T> {
    initialValue: T;
    renderContent: Productor<DialogContentProps<T>, ReactNode>;
    confirmable?: boolean;
    cancelable?: boolean;
    // easyQuit?: boolean;
}