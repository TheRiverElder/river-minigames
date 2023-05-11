import ConfigItem from "../ui/config/ConfigItem";
import Behavior from "./Behavior";

export default class BehaviorAdaptor extends Behavior {

    restore(data: any): void { }
    receiveUpdatePack(data: any): void { }

    onInitialize(): void { }
    onDestroy(): void { }

    get configItems(): ConfigItem<any>[] { return []; }
}