import { Consumer, int, Unique } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import Registry from "../libs/management/Registry";
import Channal from "./channal/Channal";
import ChannalFullUpdate from "./channal/ChannalFullUpdate";
import ChannalIncrementalUpdate from "./channal/ChannalIncrementalUpdate";
import GameObject from "./gameobject/GameObject";
import Updatable from "./io/Updatable";
import User from "./user/User";

export default class TableBottomSimulator {

    readonly behaviorTypes = new Registry<string, any>(type => type.name);

    root: Nullable<GameObject> = null;
    readonly users = new Registry<int, User>(user => user.uid); 
    readonly gameObjects = new Registry<int, GameObject>(obj => obj.uid);
    readonly updatables = new Registry<int, Updatable & Unique>(obj => obj.uid);

    readonly channals = new Registry<string, Channal>(channal => channal.name);

    initialize() {

        this.channals.add(
            new ChannalFullUpdate("full_update", this),
            new ChannalIncrementalUpdate("incremental_update", this),
        );

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