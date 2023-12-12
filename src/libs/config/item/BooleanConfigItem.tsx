import classNames from "classnames";
import { ReactNode } from "react";
import { Consumer, Pair } from "../../CommonTypes";
import Text from "../../i18n/Text";
import ConfigItem from "../ConfigItem";
import "./BooleanConfigItem.scss";

export default class BooleanConfigItem extends ConfigItem<boolean> {

    constructor(key: string, name: Text, initialValue: boolean) {
        super(key, name, initialValue);
    }

    render(config: any, setConfigItem: Consumer<Pair<string, any>>): ReactNode {
        const checked = this.getValue(config);

        return (
            <div className="BooleanConfigItem">
                <div className={classNames("switch", { checked })} onClick={() => this.setValue(!checked, setConfigItem)}>
                    <div className="block" />
                    <div className="text">{checked ? "ON" : "OFF"}</div>
                </div>
            </div>
        );
    }

}