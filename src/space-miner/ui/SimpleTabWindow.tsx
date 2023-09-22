import { Component, ReactNode } from "react";
import SpaceMinerUICommonProps, { SpaceMinerClientTab } from "./SpaceMinerUICommonProps";
import "./SimpleTabWindow.scss";
import I18nText from "../../libs/i18n/I18nText";

export interface SimpleTabWindowProps extends SpaceMinerUICommonProps {
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