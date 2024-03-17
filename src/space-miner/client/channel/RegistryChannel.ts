import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class RegistryChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_GET_KEYS = "get_keys";
    public static readonly COMMAND_GET_VALUES = "get_values";
    public static readonly COMMAND_GET = "get";

    public static readonly REGISTRY_RESOURCE_TYPE = "resource_type";

    get name(): string {
        return "registry";
    }

    requestKeysOf(registryName: string): Promise<Array<string>> {
        return this.request({ command: RegistryChannel.COMMAND_GET_KEYS, data: registryName });
    }
    
    receive(pack: CommandPack): void { }

}