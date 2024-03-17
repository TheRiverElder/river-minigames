import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class RegistryServerChannel extends SpaceMinerChannel<any, CommandPack> {

    public static readonly COMMAND_GET_KEYS = "get_keys";
    public static readonly COMMAND_GET_VALUES = "get_values";
    public static readonly COMMAND_GET = "get";

    public static readonly REGISTRY_RESOURCE_TYPE = "resource_type";

    get name(): string {
        return "registry";
    }

    responseKeysOf(registryName: string, id: number) {
        let registry;
        switch(registryName) {
            case RegistryServerChannel.REGISTRY_RESOURCE_TYPE: registry = this.runtime.game.world.resourceTypes; break;
        }
        this.send(
            registry?.keys() ?? [],
            id,
        );
    }

    responseValuesOf(registryName: string, id: number) {
        // return this.request({ command: registryName });
        throw new Error("not implemented");
    }

    responseOf(registryName: string, key: string, id: number) {
        // return this.request({ command: registryName });
        throw new Error("not implemented");
    }

    response(id: number, pack: CommandPack): void {
        const { command, data } = pack;
        switch (command) {
            case RegistryServerChannel.COMMAND_GET_KEYS: this.responseKeysOf(data, id); break;
            case RegistryServerChannel.COMMAND_GET_VALUES: this.responseValuesOf(data, id); break;
            case RegistryServerChannel.COMMAND_GET: this.responseOf(data[0], data[1], id); break;
        }
    }

}