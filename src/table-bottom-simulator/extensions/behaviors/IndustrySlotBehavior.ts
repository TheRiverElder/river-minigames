import ConfigItem from "../../ui/config/ConfigItem";
import SelectConfigItem from "../../ui/config/SelectConfigItem";
import { CITIES } from "../Constants";
import BirminghamBaseBehavior from "./BirminghamBaseBehavior";

export default class IndustrySlotBehavior extends BirminghamBaseBehavior {
    city: string = "";

    override get configItems(): Array<ConfigItem> {
        return [
            new SelectConfigItem("city", {
                get: () => this.city,
                set: this.createSetterAndSendUpdater(v => this.city = v),
            }, {
                getOptions: () => CITIES,
                getValue: o => o,
                getOption: o => o,
                getName: o => o,
            }),
        ];
    }
}