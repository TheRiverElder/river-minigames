import { ReactNode } from "react";
import { int, Productor, Supplier } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import ListenerManager from "../libs/management/ListenerManager";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Vector2 from "../libs/math/Vector2";
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

    createWindow(createContent: Productor<GameWindow, GameWindowContent>) {
        return new GameWindow(this.uidGenerator.generate(), this, createContent);
    }

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

    readonly onUiUpdateListeners = new ListenerManager<GameWindow>();

    updateUi() {
        this.onUiUpdateListeners.emit(this);
    }

    readonly uid: int;
    readonly simulator: TableBottomSimulatorClient;
    readonly content: GameWindowContent;

    private _name: string = "Window";
    get name(): string { return this._name; }
    set name(value: string) { this._name = value; this.updateUi(); }

    private _position: Vector2 = new Vector2(100, 100);
    get position(): Vector2 { return this._position; }
    set position(value: Vector2) { this._position = value; this.updateUi(); }

    private _size: Vector2 = new Vector2(100, 100);
    get size(): Vector2 { return this._size; }
    set size(value: Vector2) { this._size = value; this.updateUi(); }

    constructor(uid: int, simulator: TableBottomSimulatorClient, createContent: Productor<GameWindow, GameWindowContent>) {
        this.uid = uid;
        this.simulator = simulator;
        this.content = createContent(this);
    }

    renderContent(): ReactNode {
        return this.content.render(this);
    }

    close() {
        this.simulator.windows.remove(this);
    }
}

export abstract class GameWindowContent {

    readonly window: GameWindow;

    constructor(window: GameWindow) {
        this.window = window;
    }

    abstract render(window: GameWindow): ReactNode;
}