import ConfigItem from "./ConfigItem";

export interface Configurable {
    get configItems(): Array<ConfigItem>;
    get config(): any;
    set config(value: any);
}