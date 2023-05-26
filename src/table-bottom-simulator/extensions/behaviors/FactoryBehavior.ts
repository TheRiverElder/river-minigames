import { int, Pair } from "../../../libs/CommonTypes";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import ConfigItem from "../../ui/config/ConfigItem";
import SelectConfigItem from "../../ui/config/SelectConfigItem";
import ShoppingListConfigItem from "../../ui/config/ShoppingListConfigItem";
import { FACTORY_TYPES, RESOURCE_TYPES } from "../Constants";

export default class FactoryBehavior extends BehaviorAdaptor {
    factoryType: string = "";
    costs: Array<Pair<string, int>> = [];
    award: Array<Pair<string, int>> = [];

    override get configItems(): Array<ConfigItem> {
        return [
            new SelectConfigItem("factoryType", {
                get: () => this.factoryType,
                set: this.createSetterAndSendUpdater(v => (this.factoryType = v))
            }, {
                getOptions: () => FACTORY_TYPES,
                getValue: o => o,
                getOption: o => o,
                getName: o => o,
            }),
            new ShoppingListConfigItem("costs", {
                get: () => this.costs,
                set: this.createSetterAndSendUpdater(v => (this.costs = v))
            }, {
                getKeys: () => RESOURCE_TYPES,
                getKeyValue: o => o,
                getKeyByKeyValue: o => o,
                getName: o => o,
                createNewRow: () => ["", 0],
            }),
            new ShoppingListConfigItem("award", {
                get: () => this.award,
                set: this.createSetterAndSendUpdater(v => (this.award = v))
            }, {
                getKeys: () => RESOURCE_TYPES,
                getKeyValue: o => o,
                getKeyByKeyValue: o => o,
                getName: o => o,
                createNewRow: () => ["", 0],
            }),
        ];
    }
}