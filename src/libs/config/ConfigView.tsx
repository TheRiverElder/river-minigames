import { Component, ReactNode } from "react";
import { Pair } from "../CommonTypes";
import I18n from "../i18n/I18n";
import { Configurable } from "./Configurable";
import "./ConfigView.scss";

export interface ConfigViewProps {
    configurable: Configurable;
    i18n?: I18n;
}

export interface ConfigViewState {
    config: any;
}

export default class ConfigView extends Component<ConfigViewProps, ConfigViewState> {
    
    constructor(props: ConfigViewProps) {
        super(props);

        this.state = {
            config: props.configurable.config,
        };
    }

    setConfigItem = ([key, value]: Pair<string, any>) => {
        const newConfig = { 
            ...this.state.config, 
            [key]: value,
        };
        this.setState({ config: newConfig });
    };

    resetConfig = () => {
        this.setState({ config: this.props.configurable.config });
    };

    applyConfig = () => {
        this.props.configurable.config = this.state.config;
        this.setState({ config: this.props.configurable.config });
        this.forceUpdate();
    };

    override render(): ReactNode {
        const configItems = this.props.configurable.configItems;
        const config = this.state.config;
        const i18n = this.props.i18n || I18n.EMPTY;

        return (
            <div className="ConfigView">
                <div className="config-items">
                    {configItems.map((item, index) => (
                        <div className="config-item" key={index}>
                            <span className="name">{item.name.process(i18n)}</span>
                            <div className="input">{item.render(config, this.setConfigItem)}</div>
                        </div>
                    ))}
                </div>
                <div className="bottom-bar">
                    <button onClick={this.resetConfig}>{this.processText("libs.ui.config_view.button.reset", "Reset", this.props.i18n)}</button>
                    <button onClick={this.applyConfig}>{this.processText("libs.ui.config_view.button.apply", "Apply", this.props.i18n)}</button>
                </div>
            </div>
        );
    }

    processText(key: string, defaultValue: string, i18n?: I18n) {
        if (i18n) return i18n.get(key);
        else return defaultValue;
    }
}