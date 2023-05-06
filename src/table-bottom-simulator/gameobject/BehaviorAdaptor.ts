import Behavior from "./Behavior";

export default class BehaviorAdaptor extends Behavior {

    restore(data: any): void { }
    receiveUpdatePack(data: any): void { }

    onInitialize(): void { }
    onDestroy(): void { }
}