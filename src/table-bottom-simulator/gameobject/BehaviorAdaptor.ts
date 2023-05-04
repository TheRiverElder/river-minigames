import Behavior from "./Behavior";

export default class BehaviorAdaptor extends Behavior {
    save(): any { return {}; }
    restore(data: any): void { }
    generateUpdatePack(): any { return {}; }
    receiveUpdatePack(data: any): void { }

    onDestroy(): void { }
}