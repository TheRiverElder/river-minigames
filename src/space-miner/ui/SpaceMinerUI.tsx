import { Component } from "react";
import I18n from "../../libs/i18n/I18n";
import { Nullable } from "../../libs/lang/Optional";
import SpaceMinerI18nResource from "../assets/SpaceMinerI18nResource";
import { SpaceMinerClientTab, SpaceMinerUIController, SpaceMinerClientDialog, DialogDetail, SpaceMinerClientCommonProps } from "./common";
import Overlay from "./frame/Overlay";
import SimpleTabWindow from "./frame/SimpleTabWindow";
import GameUI from "./game/GameUI";
import MainMenu from "./MainMenu";
import "./SpaceMinerUI.scss";
import "./common/styles.scss";
import SimpleDialogWrapper from "./frame/SimpleDialogWrapper";
import { Consumer } from "../../libs/CommonTypes";
import { ifNotNull } from "../../libs/lang/Objects";
import Text from "../../libs/i18n/Text";
import MessageNotifier from "./frame/MessageNotifier";
import ListenerManager from "../../libs/management/ListenerManager";
import PlainText from "../../libs/i18n/PlainText";
import SpaceMinerApi from "../client/SpaceMinerApi";
import SimpleSpaceMinerApi from "../client/SimpleSpaceMinerApi";
import I18nText from "../../libs/i18n/I18nText";

export interface SpaceMinerUIState {
    i18n: I18n;
    // game: Nullable<Game>;
    gameApi: Nullable<SpaceMinerApi>;
    tab: Nullable<SpaceMinerClientTab>;
    dialogPack: Nullable<SpaceMinerClientDialogPack>;
}

interface SpaceMinerClientDialogPack<T = any> {
    dialog: SpaceMinerClientDialog<T>;
    resolve: Consumer<T>;
    reject: Consumer<Error>;
}

/**
 * Tab只是一个窗口，可以随时关闭
 * Dialog是一个交互对话框，通常需要返回一个值，例如输入数字、字符串等，或用于载入动画的播放。它与Tab的区别是他会返回Promise
 */
export default class SpaceMinerUI extends Component<any, SpaceMinerUIState> implements SpaceMinerUIController {

    resources = new Map<string, string>();

    readonly listeners = {
        MESSAGE: new ListenerManager<Text>(),
    };

    state: SpaceMinerUIState = {
        i18n: new I18n(SpaceMinerI18nResource),
        // game: null,
        gameApi: null,
        tab: null,
        dialogPack: null,
    };

    override render() {
        const { tab, dialogPack, gameApi, i18n } = this.state;
        const commonProps: SpaceMinerClientCommonProps = {
            i18n: this.state.i18n,
            uiController: this,
        };

        return (
            <div className="SpaceMinerUI">
                {gameApi ? (
                    <GameUI gameApi={gameApi} i18n={i18n} uiController={this} />
                ) : (
                    <MainMenu i18n={i18n} uiController={this} />
                )}

                {tab && (
                    <Overlay onClickBackground={() => this.closeTab()}>
                        <SimpleTabWindow tab={tab} onClose={() => {
                            this.closeTab();
                            if (tab.screen) tab.screen.close(); 
                        }} {...commonProps} />
                    </Overlay>
                )}

                {dialogPack && (
                    <Overlay onClickBackground={() => (dialogPack.dialog.blurable ?? !!dialogPack.dialog.cancelable) && this.closeDialog()}>
                        <SimpleDialogWrapper
                            i18n={this.state.i18n}
                            dialog={dialogPack.dialog}
                            resolve={value => {
                                dialogPack.resolve(value);
                                this.closeDialog();
                            }}
                            reject={error => {
                                dialogPack.reject(error);
                                this.closeDialog();
                            }}
                        />
                    </Overlay>
                )}

                <MessageNotifier className="messages" i18n={i18n} listeners={this.listeners.MESSAGE} />
            </div>
        );
    }

    openTab = (tab: SpaceMinerClientTab) => this.setState({ tab });
    closeTab = () => this.setState({ tab: null });
    openDialog = (dialog: SpaceMinerClientDialog<any>) => new Promise<any>((resolve, reject) => this.setState({ dialogPack: { dialog, resolve, reject } }));
    closeDialog = () => this.setState({ dialogPack: null });
    openDialogDetail<T>(dialog: SpaceMinerClientDialog<T>): DialogDetail<T> {
        let resolvePromise: Nullable<Consumer<T>>;
        let rejectPromise: Nullable<(error?: Error) => void>;
        const promise = new Promise<any>((resolve, reject) => {
            resolvePromise = resolve;
            rejectPromise = reject;
            this.setState({ dialogPack: { dialog, resolve, reject } });
        });

        return {
            promise,
            resolve: (value: T) => ifNotNull(resolvePromise, func => {
                func(value);
                this.closeDialog();
            }),
            reject: (error?: Error) => ifNotNull(rejectPromise, func => {
                func(error);
                this.closeDialog();
            }),
        };
    }

    startGame(gameApi: SpaceMinerApi): void { 
        gameApi.screens.onAddListeners.add(screen => this.openTab({
            title: new I18nText(`screen.${screen.type.id}.title`),
            contentProvider: screen.getComponentProvider(),
            screen,
        }));
        gameApi.screens.onRemoveListeners.add(() => this.closeTab());
        this.setState({ gameApi }); 
        gameApi.start();
    }
    
    endGame(): void {
        this.setState({ gameApi: null, dialogPack: null, tab: null });
        this.state.gameApi?.stop();
    }

    displayMessage(text: string | Text): void {
        const t = typeof text === 'string' ? new PlainText(text) : text;
        this.listeners.MESSAGE.emit(t);
    }
}