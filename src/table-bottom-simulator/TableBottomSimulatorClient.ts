import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import ListsenerManager from "../libs/management/ListenerManager";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Channal from "./channal/Channel";
import ChannelFullUpdate from "./channal/ChannelFullUpdate";
import ChannelIncrementalUpdate from "./channal/ChannelIncrementalUpdate";
import Communication from "./Communication";
import GameObject from "./gameobject/GameObject";
import Gamer from "./user/Gamer";
import User from "./user/User";

export default class TableBottomSimulatorClient {

    readonly behaviorTypes = new Registry<string, any>(type => type.name);

    readonly users = new ObservableRegistry<int, User>(user => user.uid); 
    readonly gamers = new Registry<string, Gamer>(gamer => gamer.name); 
    readonly gameObjects = new ObservableRegistry<int, GameObject>(obj => obj.uid);
    readonly channels = new Registry<string, Channal>(channal => channal.name);
    communication: Nullable<Communication> = null;

    readonly channelFullUpdate = new ChannelFullUpdate("full_update", this);
    readonly channelIncrementalUpdate = new ChannelIncrementalUpdate("incremental_update", this);

    constructor() {
        this.channels.add(this.channelFullUpdate);
        this.channels.add(this.channelIncrementalUpdate);
    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    readonly onWholeUiUpdate = new ListsenerManager<int>();

}