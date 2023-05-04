import { Consumer, int, Unique } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import BehaviorPoinerListener from "./builtin/behavior/BehaviorPoinerListener";
import Channal from "./channal/Channal";
import ChannalFullUpdate from "./channal/ChannalFullUpdate";
import ChannalIncrementalUpdate from "./channal/ChannalIncrementalUpdate";
import { Side } from "./gameobject/Behavior";
import GameObject from "./gameobject/GameObject";
import Updatable from "./io/Updatable";
import User from "./user/User";

export class ActualSide {

    static readonly SERVER = new ActualSide(true);
    static readonly ClIENT = new ActualSide(false);

    readonly isServer: boolean;
    get isClient(): boolean {
        return !this.isServer;
    }

    constructor(isServer: boolean) {
        this.isServer = isServer;
    }

    canAccept(side: Side): boolean {
        return (this.isServer && side.activeOnServer) || (this.isClient && side.activeOnClient);
    }
}

export default class TableBottomSimulator {

    readonly side: Side;

    readonly behaviorTypes = new Registry<string, any>(type => type.name);

    readonly root: GameObject = new GameObject(this, 0);
    readonly users = new Registry<int, User>(user => user.uid); 
    // root 不在这里
    readonly gameObjects = new Registry<int, GameObject>(obj => obj.uid);
    // 但是 root 在这里
    readonly updatables = new Registry<int, Updatable & Unique>(obj => obj.uid);

    readonly channals = new Registry<string, Channal>(channal => channal.name);

    constructor(side: Side) {
        this.side = side;
        this.updatables.add(this.root);
        this.channals.add(
            new ChannalFullUpdate("full_update", this),
            new ChannalIncrementalUpdate("incremental_update", this),
        );
    }

    initialize() {


    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    createGameObject(parent: Nullable<GameObject> = null): GameObject {
        if (!this.side.activeOnServer) throw new Error("Cannot run on client!");
        const gameObject = new GameObject(this, this.uidGenerator.generate());
        if (parent) {
            gameObject.parent = parent;
        }
        return gameObject;
    }

    updateUi() {
        if (this.side.activeOnServer || !this.side.activeOnClient) throw new Error("Only run on client!");
        const behavior: Nullable<BehaviorPoinerListener> = this.root.behaviors.getBehavior(BehaviorPoinerListener);
        if (behavior) {
            setTimeout(() => behavior.onUiUpdate.emit(), 0);
        }
    }


    readonly onUserConnectListeners = new Set<Consumer<User>>();
    readonly onUserDisconnectListeners = new Set<Consumer<User>>();

    userConnect(user: User) {
        this.users.add(user);
        this.onUserConnectListeners.forEach(l => l(user))
    }

    userDisconnect(user: User) {
        this.users.remove(user);
        this.onUserDisconnectListeners.forEach(l => l(user))
    }



}