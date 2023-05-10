import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import ListenerManager from "../libs/management/ListenerManager";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Channal from "./channal/Channel";
import ChannelFullUpdate from "./channal/FullUpdateChannal";
import ChannelIncrementalUpdate from "./channal/IncrementalUpdateChannal";
import Communication from "./communication/Communication";
import BehaviorType from "./gameobject/BehaviorType";
import GameObject from "./gameobject/GameObject";
import User from "./user/User";

export default class TableBottomSimulatorClient {

    readonly behaviorTypes = new Registry<string, BehaviorType>(type => type.name);

    // readonly gamers = new Registry<string, Gamer>(gamer => gamer.name); 
    readonly users = new ObservableRegistry<int, User>(user => user.uid); 
    readonly gameObjects = new ObservableRegistry<int, GameObject>(obj => obj.uid);
    readonly channels = new Registry<string, Channal>(channal => channal.name);
    communication: Nullable<Communication> = null;
    readonly selfUserUid: int;
    get selfuser(): User {
        return this.users.getOrThrow(this.selfUserUid);
    }

    readonly channelFullUpdate = new ChannelFullUpdate("full_update", this);
    readonly channelIncrementalUpdate = new ChannelIncrementalUpdate("incremental_update", this);

    constructor(selfUserUid: int) {
        this.selfUserUid = selfUserUid;

        this.channels.add(this.channelFullUpdate);
        this.channels.add(this.channelIncrementalUpdate);
    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    readonly onWholeUiUpdate = new ListenerManager();

    readonly onServerConnected = new ListenerManager<Communication>();
    readonly onServerDisconnected = new ListenerManager<Communication>();
}