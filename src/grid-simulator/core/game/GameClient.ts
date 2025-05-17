import Registry from "../../../libs/management/Registry";
import ValueDisplayConfig from "../value/ValueDisplayConfig";
import ValueType from "../value/ValueType";

export default class GameClient {

    public readonly registryValueDisplayConfig = new Registry<ValueType, ValueDisplayConfig>(it => it.type);
    
}