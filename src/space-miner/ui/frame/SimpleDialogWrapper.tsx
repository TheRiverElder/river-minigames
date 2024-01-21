import { Component, ReactNode } from "react";
import { Consumer } from "../../../libs/CommonTypes";
import I18n from "../../../libs/i18n/I18n";
import { SpaceMinerClientDialog } from "../common";
import "./SimpleDialogWrapper.scss";

export interface DialogContentProps<T> {
    value: T;
    onChange: Consumer<T>;
}

export interface SimpleDialogWrapperProps<T> {
    i18n: I18n;
    dialog: SpaceMinerClientDialog<T>,
    resolve: Consumer<any>;
    reject: Consumer<any>;
}

export interface SimpleDialogWrapperState<T> {
    value: T;
}

export default class SimpleDialogWrapper<T> extends Component<SimpleDialogWrapperProps<T>, SimpleDialogWrapperState<T>> {
    constructor(props: SimpleDialogWrapperProps<T>) {
        super(props);
        this.state = {
            value: props.dialog.initialValue ?? null as any,
        };
    }

    override render(): ReactNode {
        const cancelable = this.props.dialog.cancelable ?? false;
        const confirmable = this.props.dialog.confirmable ?? true;


        return (
            <div className="SimpleDialogWrapper">
                <div className="content">
                    {this.props.dialog.renderContent({
                        value: this.state.value,
                        onChange: v => this.setState({ value: v }),
                    })}
                </div>
                {(confirmable || cancelable) && (
                    <div className="buttom-bar">
                        {confirmable && (<button onClick={() => this.props.resolve(this.state.value)} >{this.props.i18n.get(`ui.dialog.confirm`)}</button>)}
                        {cancelable && (<button className="light" onClick={() => this.props.reject(null)} >{this.props.i18n.get(`ui.dialog.cancel`)}</button>)}
                    </div>
                )}
            </div>
        );
    }
}