import { ChangeEvent, ReactNode } from "react";
import { Consumer, Pair } from "../../CommonTypes";
import Text from "../../i18n/Text";
import ConfigItem from "../ConfigItem";
import "./NumberConfigItem.scss";

export default class NumberConfigItem extends ConfigItem<number> {

    readonly minimium: number;
    readonly maximium: number;
    readonly step: number;

    constructor(key: string, name: Text, initialValue: number, minimium: number, maximium: number, step: number) {
        super(key, name, initialValue);
        this.minimium = minimium;
        this.maximium = maximium;
        this.step = step;
    }

    render(config: any, setConfigItem: Consumer<Pair<string, any>>): ReactNode {
        const props = {
            min: this.minimium,
            max: this.maximium,
            step: this.step,
            value: this.getValue(config),
            onChange: (e: ChangeEvent<HTMLInputElement>) => this.setValue(parseFloat(e.target.value), setConfigItem),
        };
        return (
            <div className="NumberConfigItem">
                <input type="range" {...props} />
                <input type="number" {...props} />
            </div>
        );
    }

}