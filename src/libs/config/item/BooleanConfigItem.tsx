import { ReactNode, ChangeEvent } from "react";
import { Consumer, Pair } from "../../CommonTypes";
import Text from "../../i18n/Text";
import ConfigItem from "../ConfigItem";

export default class BooleanConfigItem extends ConfigItem<boolean> {

    constructor(key: string, name: Text, initialValue: boolean) {
        super(key, name, initialValue);
    }

    render(config: any, setConfigItem: Consumer<Pair<string, any>>): ReactNode {
        const props = {
            checked: this.getValue(config),
            onChange: (e: ChangeEvent<HTMLInputElement>) => this.setValue(e.target.checked, setConfigItem),
        };
        return (
            <div className="BooleanConfigItems">
                <input type="checkbox" {...props} />
            </div>
        );
    }

}