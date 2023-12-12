import ConfigItem from "./ConfigItem";

export interface Configurable {
    getConfigItems(): Array<ConfigItem>;
    getConfig(): any;
    setConfig(value: any): void;
}