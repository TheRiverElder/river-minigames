import { Displayable } from "../../../libs/io/Displayable";
import Optional from "../../../libs/lang/Optional";
import Registry from "../../../libs/management/Registry";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class RegistryServerChannel extends ServerChannel {

    get name(): string {
        return "registry";
    }

    private getRegistry<T extends Displayable>(registryName: string): Optional<Registry<string, T>> {
        switch (registryName) {
            case Commands.REGISTRY.REGISTRY_RESOURCE_TYPE: return Optional.of(this.runtime.game.world.resourceTypes as any);
            case Commands.REGISTRY.REGISTRY_RECIPE: return Optional.of(this.runtime.game.recipes as any);
            default: return Optional.ofNull();
        }
    }

    override receive(command: string, data?: any): any {
        switch (command) {
            case Commands.REGISTRY.COMMAND_GET_KEYS: return this.getRegistry(data).map(it => it.keys()).orElse([]);
            case Commands.REGISTRY.COMMAND_GET_VALUES: return this.getRegistry(data).map(it => it.values().map(it => it.getDisplayedModel())).orElse([]);
            case Commands.REGISTRY.COMMAND_GET: this.getRegistry(data[0]).map(it => it.get(data[1]).map(it => it.getDisplayedModel()).get()).orElse(null); break;
        }
    }

}