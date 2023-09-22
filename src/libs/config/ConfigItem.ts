import { ReactNode } from "react";
import { Consumer, Pair } from "../CommonTypes";
import Text from "../i18n/Text";

export default abstract class ConfigItem<T = any> {

    readonly key: string;
    readonly name: Text;
    readonly initialValue: T;

    constructor(key: string, name: Text, initialValue: T) {
        this.key = key;
        this.name = name;
        this.initialValue = initialValue;
    }

    setValue(value: T, setConfigItem: Consumer<Pair<string, T>>) {
        setConfigItem([this.key, value]);
    }

    getValue(config: any): T {
        if (Object.hasOwn(config, this.key)) return config[this.key];
        else return this.initialValue;
    }

    abstract render(config: any, setConfigItem: Consumer<Pair<string, T>>): ReactNode;
}