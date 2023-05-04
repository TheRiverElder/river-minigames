import Behavior, { Side } from "./Behavior";

export default class BehaviorAdaptor extends Behavior {
    get side(): Side {
        return Side.NONE;
    }

    save(): any { return {}; }
    restore(data: any): void { }
    generateUpdatePack(): any { return {}; }
    receiveUpdatePack(data: any): void { }

    onInitialize(): void { }
    onDestroy(): void { }
}