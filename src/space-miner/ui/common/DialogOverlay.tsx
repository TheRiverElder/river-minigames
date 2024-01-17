import { Component, ReactNode } from "react";
import { Consumer, Productor } from "../../../libs/CommonTypes";
import I18n from "../../../libs/i18n/I18n";
import SpaceMinerUICommonProps, { SpaceMinerClientDialog } from "../SpaceMinerUICommonProps";
import "./DialogOverlay.scss";

export interface DialogContentProps<T> {
    value: T;
    onChange: Consumer<T>;
}

export interface DialogOverlayProps<T> {
    i18n: I18n;
    dialog: SpaceMinerClientDialog<T>,
    resolve: Consumer<any>;
    reject: Consumer<any>;
}

export interface DialogOverlayState<T> {
    value: T;
}

export default class DialogOverlay<T> extends Component<DialogOverlayProps<T>, DialogOverlayState<T>> {
    constructor(props: DialogOverlayProps<T>) {
        super(props);
        this.state = {
            value: props.dialog.initialValue,
        };
    }

    override render(): ReactNode {
        const cancelable = this.props.dialog.cancelable ?? false;
        const confirmable = this.props.dialog.confirmable ?? true;


        return (
            <div className="DialogOverlay">
                <div className="content">
                    {this.props.dialog.renderContent({
                        value: this.state.value,
                        onChange: v => this.setState({ value: v }),
                    })}
                </div>
                {(confirmable || cancelable) && (
                    <div className="buttom-bar">
                        {cancelable && (<button className="light" onClick={() => this.props.reject(null)} >{this.props.i18n.get(`ui.dialog.cancel`)}</button>)}
                        {confirmable && (<button onClick={() => this.props.resolve(this.state.value)} >{this.props.i18n.get(`ui.dialog.confirm`)}</button>)}
                    </div>
                )}
            </div>
        );
    }
}