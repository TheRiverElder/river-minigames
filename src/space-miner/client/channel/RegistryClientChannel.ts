import Commands from "../../common/channel/Commands";
import ClientChannel from "./ClientChannel";

export default class RegistryClientChannel extends ClientChannel {

    get name(): string {
        return "registry";
    }

    requestGetKeysOf(registryName: string): Promise<Array<string>> {
        return this.request(Commands.REGISTRY.COMMAND_GET_KEYS, registryName);
    }

    requestGetValuesOf<T>(registryName: string): Promise<Array<T>> {
        return this.request(Commands.REGISTRY.COMMAND_GET_VALUES, registryName);
    }

    requestGet<T>(registryName: string, key: string): Promise<T> {
        return this.request(Commands.REGISTRY.COMMAND_GET, [registryName, key]);
    }

}