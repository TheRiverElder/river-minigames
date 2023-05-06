import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import ListsenerManager from "../libs/management/ListenerManager";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Channal from "./channal/Channal";
import ChannalFullUpdate from "./channal/ChannalFullUpdate";
import ChannalIncrementalUpdate from "./channal/ChannalIncrementalUpdate";
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

    readonly channalFullUpdate = new ChannalFullUpdate("full_update", this);
    readonly channalIncrementalUpdate = new ChannalIncrementalUpdate("incremental_update", this);

    constructor() {
        this.channels.add(this.channalFullUpdate);
        this.channels.add(this.channalIncrementalUpdate);
    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    readonly onWholeUiUpdate = new ListsenerManager<int>();

}