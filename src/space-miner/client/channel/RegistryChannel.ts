import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class RegistryChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_GET_KEYS = "get_keys";
    public static readonly COMMAND_GET_VALUES = "get_values";
    public static readonly COMMAND_GET = "get";

    public static readonly REGISTRY_RESOURCE_TYPE = "resource_type";
    public static readonly REGISTRY_RECIPE = "recipe";

    get name(): string {
        return "registry";
    }

    requestGetKeysOf(registryName: string): Promise<Array<string>> {
        return this.request({ command: RegistryChannel.COMMAND_GET_KEYS, data: registryName });
    }

    requestGetValuesOf<T>(registryName: string): Promise<Array<T>> {
        return this.request({ command: RegistryChannel.COMMAND_GET_VALUES, data: registryName });
    }

    requestGet<T>(registryName: string, key: string): Promise<T> {
        return this.request({ command: RegistryChannel.COMMAND_GET, data: [registryName, key] });
    }

}