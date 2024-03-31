import { Component, ReactNode } from "react";
import { SpaceMinerClientCommonProps, SpaceMinerClientTab, purifyCommonProps } from "../common";
import "./SimpleTabWindow.scss";
import I18nText from "../../../libs/i18n/I18nText";

export interface SimpleTabWindowProps extends SpaceMinerClientCommonProps {
    tab: SpaceMinerClientTab;
    onClose: Function;
}

export default class SimpleTabWindow extends Component<SimpleTabWindowProps> {

    static readonly TEXT_CLOSE = new I18nText(`ui.simple_tab_window.button.close`);

    override render(): ReactNode {
        const { tab, i18n, onClose } = this.props;
        const WindowContentComponent = tab.contentProvider;
        const commonProps = purifyCommonProps(this.props);

        return (
            <div className="SimpleTabWindow">
                <div className="top-bar bg-gradient light-blue">
                    <span className="title">{tab.title.process(i18n)}</span>
                    <div className="button close" onClick={() => onClose()}>
                        <span>{SimpleTabWindow.TEXT_CLOSE.process(i18n)}</span>
                    </div>
                </div>
                <div className="content">
                    <WindowContentComponent {...commonProps}/>
                </div>
            </div>
        )
    }
}