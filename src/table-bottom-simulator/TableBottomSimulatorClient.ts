import { ReactNode } from "react";
import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import ListenerManager from "../libs/management/ListenerManager";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import BehaviorInstructionChannel from "./channal/BehaviorInstructionChannel";
import Channel from "./channal/Channel";
import FullUpdateChannal from "./channal/FullUpdateChannal";
import IncrementalUpdateChannal from "./channal/IncrementalUpdateChannal";
import Communication from "./communication/Communication";
import BehaviorType from "./gameobject/BehaviorType";
import GameObject from "./gameobject/GameObject";
import User from "./user/User";

export default class TableBottomSimulatorClient {

    readonly behaviorTypes = new Registry<string, BehaviorType>(type => type.name);

    // readonly gamers = new Registry<string, Gamer>(gamer => gamer.name); 
    readonly users = new ObservableRegistry<int, User>(user => user.uid); 
    readonly gameObjects = new ObservableRegistry<int, GameObject>(obj => obj.uid);
    readonly channels = new Registry<string, Channel>(channal => channal.name);
    readonly windows = new Registry<int, GameWindow>(window => window.uid);
    communication: Nullable<Communication> = null;

    // Client Only
    readonly selfUserUid: int;
    get selfuser(): User {
        return this.users.getOrThrow(this.selfUserUid);
    }

    readonly channelFullUpdate = new FullUpdateChannal("full_update", this);
    readonly channelIncrementalUpdate = new IncrementalUpdateChannal("incremental_update", this);
    readonly channelBehaviorInstruction = new BehaviorInstructionChannel("behavior_instruction", this);

    constructor(selfUserUid: int) {
        this.selfUserUid = selfUserUid;

        this.channels.add(this.channelFullUpdate);
        this.channels.add(this.channelIncrementalUpdate);
        this.channels.add(this.channelBehaviorInstruction);
    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    readonly onWholeUiUpdateListeners = new ListenerManager();

    readonly onServerConnected = new ListenerManager<Communication>();
    readonly onServerDisconnected = new ListenerManager<Communication>();
}

export class GameWindow {
    readonly uid: int;
    readonly simulator: TableBottomSimulatorClient;
    readonly content: GameWindowContent;

    constructor(uid: int, simulator: TableBottomSimulatorClient, content: GameWindowContent) {
        this.uid = uid;
        this.simulator = simulator;
        this.content = content;
    }

    render(): ReactNode {
        return this.content.render(this);
    }

    close() {
        this.simulator.windows.remove(this);
    }
}

export interface GameWindowContent {
    render(window: GameWindow): ReactNode;
}