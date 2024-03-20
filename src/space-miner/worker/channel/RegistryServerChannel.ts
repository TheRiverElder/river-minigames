import { Displayable } from "../../../libs/io/Displayable";
import Optional from "../../../libs/lang/Optional";
import Registry from "../../../libs/management/Registry";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannel from "./SpaceMinerServerChannel";

export default class RegistryServerChannel extends SpaceMinerChannel<any, CommandPack> {

    public static readonly COMMAND_GET_KEYS = "get_keys";
    public static readonly COMMAND_GET_VALUES = "get_values";
    public static readonly COMMAND_GET = "get";

    public static readonly REGISTRY_RESOURCE_TYPE = "resource_type";
    public static readonly REGISTRY_RECIPE = "recipe";

    get name(): string {
        return "registry";
    }

    private getRegistry<T extends Displayable>(registryName: string): Optional<Registry<string, T>> {
        switch (registryName) {
            case RegistryServerChannel.REGISTRY_RESOURCE_TYPE: return Optional.of(this.runtime.game.world.resourceTypes as any);
            case RegistryServerChannel.REGISTRY_RECIPE: return Optional.of(this.runtime.game.recipes as any);
            default: return Optional.ofNull();
        }
    }

    responseGetKeysOf(registryName: string, id: number) {
        this.send(this.getRegistry(registryName).map(it => it.keys()).orElse([]), id);
    }

    responseGetValuesOf(registryName: string, id: number) {
        this.send(this.getRegistry(registryName).map(it => it.values().map(it => it.getDisplayedModel())).orElse([]), id);
    }

    responseGetOf(registryName: string, key: string, id: number) {
        this.send(this.getRegistry(registryName).map(it => it.get(key).map(it => it.getDisplayedModel()).get()).orElse(null), id);
    }

    response(id: number, pack: CommandPack): void {
        const { command, data } = pack;
        switch (command) {
            case RegistryServerChannel.COMMAND_GET_KEYS: this.responseGetKeysOf(data, id); break;
            case RegistryServerChannel.COMMAND_GET_VALUES: this.responseGetValuesOf(data, id); break;
            case RegistryServerChannel.COMMAND_GET: this.responseGetOf(data[0], data[1], id); break;
        }
    }

}