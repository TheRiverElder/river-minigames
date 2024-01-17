import { Component, ReactNode } from "react";
import { Productor } from "../../libs/CommonTypes";
import I18n from "../../libs/i18n/I18n";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import DialogOverlay from "./common/DialogOverlay";
import GameUI from "./GameUI";
import MainMenu from "./MainMenu";
import Overlay from "./Overlay";
import SimpleTabWindow from "./SimpleTabWindow";
import SpaceMinerI18nResource from "./SpaceMinerI18nResource";
import "./SpaceMinerUI.scss";
import { SpaceMinerClient, SpaceMinerClientDialog, SpaceMinerClientTab, SpaceMinerUIController } from "./SpaceMinerUICommonProps";

export interface SpaceMinerUIState {
    i18n: I18n;
    game: Nullable<Game>;
    tab: Nullable<SpaceMinerClientTab>;
    dialog: Nullable<ReactNode>;
}

export default class SpaceMinerUI extends Component<any, SpaceMinerUIState> implements SpaceMinerUIController {
    resources = new Map<string, string>();

    constructor(props: any) {
        super(props);

        this.state = {
            i18n: new I18n(SpaceMinerI18nResource),
            game: null,
            tab: null,
            dialog: null,
        };
    }

    override render() {
        const commonProps = {
            i18n: this.state.i18n,
        };

        return (
            <div className="SpaceMinerUI">
                {this.state.game ? (
                    <GameUI game={this.state.game} i18n={this.state.i18n} uiController={this} />
                ) : (
                    <MainMenu setGame={game => this.setState({ game })} i18n={this.state.i18n} uiController={this} />
                )}


                {this.state.tab && (
                    <Overlay>
                        <SimpleTabWindow tab={this.state.tab} onClose={() => this.closeTab()} {...commonProps} />
                    </Overlay>
                )}


                {this.state.dialog}
            </div>
        );
    }



    openTab = (tab: SpaceMinerClientTab) => this.setState({ tab });
    closeTab = () => this.setState({ tab: null });

    openDialog<T>(dialog: SpaceMinerClientDialog<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.setState({
                dialog: (
                    <DialogOverlay
                        dialog={dialog}
                        resolve={v => {
                            resolve(v);
                            this.setState({ dialog: null });
                        }}
                        reject={v => {
                            reject(v);
                            this.setState({ dialog: null });
                        }}
                        i18n={this.state.i18n}
                    // game={this.state.game}
                    // resources={this.resources}
                    // client={this}
                    />
                ),
            });
        });
    }
    closeDialog = () => this.setState({ dialog: null });
}