import { Component } from "react";
import I18n from "../../libs/i18n/I18n";
import { Nullable } from "../../libs/lang/Optional";
import SpaceMinerI18nResource from "../assets/SpaceMinerI18nResource";
import Game from "../Game";
import { SpaceMinerClientTab, SpaceMinerUIController, SpaceMinerClientDialog, DialogDetail } from "./common";
import Overlay from "./frame/Overlay";
import SimpleTabWindow from "./frame/SimpleTabWindow";
import GameUI from "./game/GameUI";
import MainMenu from "./MainMenu";
import "./SpaceMinerUI.scss";
import SimpleDialogWrapper from "./frame/SimpleDialogWrapper";
import { Consumer } from "../../libs/CommonTypes";
import { ifNotNull } from "../../libs/lang/Objects";
import Text from "../../libs/i18n/Text";

export interface SpaceMinerUIState {
    i18n: I18n;
    game: Nullable<Game>;
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

    constructor(props: any) {
        super(props);

        this.state = {
            i18n: new I18n(SpaceMinerI18nResource),
            game: null,
            tab: null,
            dialogPack: null,
        };
    }

    override render() {
        const { tab, dialogPack, game, i18n } = this.state;
        const commonProps = {
            i18n: this.state.i18n,
        };

        return (
            <div className="SpaceMinerUI">
                {game ? (
                    <GameUI game={game} i18n={i18n} uiController={this} />
                ) : (
                    <MainMenu i18n={i18n} uiController={this} />
                )}

                {tab && (
                    <Overlay onClickBackground={() => this.closeTab()}>
                        <SimpleTabWindow tab={tab} onClose={() => this.closeTab()} {...commonProps} />
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

    startGame(game: Game): void { this.setState({ game }); }
    endGame(): void { this.setState({ game: null, dialogPack: null, tab: null }); }

    displayMessage(text: string | Text): void {
        // TODO 不能这样啊
        this.state.game?.displayMessage(text); 
    }
}