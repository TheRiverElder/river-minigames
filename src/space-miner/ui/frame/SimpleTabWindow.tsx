import { Component, ReactNode } from "react";
import { SpaceMinerClientTab } from "../common";
import "./SimpleTabWindow.scss";
import I18nText from "../../../libs/i18n/I18nText";
import I18n from "../../../libs/i18n/I18n";

export interface SimpleTabWindowProps {
    i18n: I18n;
    tab: SpaceMinerClientTab;
    onClose: Function;
}

export default class SimpleTabWindow extends Component<SimpleTabWindowProps> {

    static readonly TEXT_CLOSE = new I18nText(`ui.simple_tab_window.button.close`);

    override render(): ReactNode {
        const { tab, i18n, onClose } = this.props;
        return (
            <div className="SimpleTabWindow">
                <div className="top-bar">
                    <span className="title">{tab.title.process(i18n)}</span>
                    <div className="button close" onClick={() => onClose()}>
                        <span>{SimpleTabWindow.TEXT_CLOSE.process(i18n)}</span>
                    </div>
                </div>
                <div className="content">
                    {tab.content}
                </div>
            </div>
        )
    }
}