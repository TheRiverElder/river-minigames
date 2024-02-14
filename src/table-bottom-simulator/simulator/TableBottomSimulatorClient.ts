import * as React from "react";
import BehaviorType from "./gameobject/BehaviorType";
import GameObject from "./gameobject/GameObject";
import Gamer from "./user/Gamer";
import User from "./user/User";
import { int, Productor } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import ListenerManager from "../../libs/management/ListenerManager";
import ObservableRegistry from "../../libs/management/ObservableRegistry";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import Vector2 from "../../libs/math/Vector2";
import CardBehavior, { CardSeries } from "../builtin/behavior/CardBehavior";
import BehaviorInstructionChannel from "../builtin/channal/BehaviorInstructionChannel";
import CardChannel from "../builtin/channal/CardChannel";
import FullUpdateChannal from "../builtin/channal/FullUpdateChannal";
import GameObjectChannal from "../builtin/channal/GameObjectChannal";
import GamePlayerChannel from "../builtin/channal/GamePlayerChannel";
import Communication from "../communication/Communication";
import Channel from "./Channel";
import { Extension } from "./Extension";
import ControllerBehavior from "../builtin/behavior/ControllerBehavior";
import PileBehavior from "../builtin/behavior/PileBehavior";
import EditChannel from "../builtin/channal/EditChannel";
import PlaceholderBehavior from "../builtin/behavior/PlaceholderBehavior";

export default class TableBottomSimulatorClient {

    readonly behaviorTypes = new Registry<string, BehaviorType>(type => type.name);

    // readonly gamers = new Registry<string, Gamer>(gamer => gamer.name); 
    readonly users = new ObservableRegistry<int, User>(user => user.uid);
    readonly gamers = new ObservableRegistry<int, Gamer>(gamer => gamer.uid);
    readonly gameObjects = new ObservableRegistry<int, GameObject>(obj => obj.uid);
    readonly channels = new Registry<string, Channel>(channal => channal.name);
    readonly extensions = new Registry<string, Extension>(extension => extension.name);
    readonly windows = new Registry<int, GameWindow>(window => window.uid);
    communication: Nullable<Communication> = null;

    createWindow<T extends typeof GameWindowContent>(content: Productor<GameWindow, T>) {
        const c = content as unknown as (typeof GameWindowContent);
        return new GameWindow(this.uidGenerator.generate(), this, c);
    }

    // Client Only
    readonly selfUserUid: int;
    get selfUser(): User {
        return this.users.getOrThrow(this.selfUserUid);
    }

    readonly channelFullUpdate = new FullUpdateChannal(this);
    readonly channelGameObject = new GameObjectChannal(this);
    readonly channelGamePlayer = new GamePlayerChannel(this);
    readonly channelCard = new CardChannel(this);
    readonly channelBehaviorInstruction = new BehaviorInstructionChannel(this);
    readonly channelEdit = new EditChannel(this);

    constructor(selfUserUid: int) {
        this.selfUserUid = selfUserUid;

        this.behaviorTypes.add(ControllerBehavior.TYPE);
        this.behaviorTypes.add(PileBehavior.TYPE);
        this.behaviorTypes.add(CardBehavior.TYPE);
        this.behaviorTypes.add(PlaceholderBehavior.TYPE);

        this.channels.add(this.channelFullUpdate);
        this.channels.add(this.channelGameObject);
        this.channels.add(this.channelGamePlayer);
        this.channels.add(this.channelCard);
        this.channels.add(this.channelBehaviorInstruction);
        this.channels.add(this.channelEdit);

        CardSeries.SERIES.onAddListeners.add(() => this.onWholeUiUpdateListeners.emit());
    }

    addExtension(extension: Extension) {
        if (this.extensions.add(extension)) {
            extension.setup();
        }
    }

    readonly uidGenerator = new IncrementNumberGenerator(1);

    readonly onWholeUiUpdateListeners = new ListenerManager();

    readonly onServerConnected = new ListenerManager<Communication>();
    readonly onServerDisconnected = new ListenerManager<Communication>();

    readonly onGameObjectClicked = new ListenerManager<GameObject>();
}

export class GameWindow {

    readonly onUiUpdateListeners = new ListenerManager<GameWindow>();

    updateUi() {
        this.onUiUpdateListeners.emit(this);
    }

    readonly uid: int;
    readonly simulator: TableBottomSimulatorClient;
    readonly content: typeof GameWindowContent;

    private _name: string = "Window";
    get name(): string { return this._name; }
    set name(value: string) { this._name = value; this.updateUi(); }

    private _position: Vector2 = new Vector2(100, 100);
    get position(): Vector2 { return this._position; }
    set position(value: Vector2) { this._position = value; this.updateUi(); }

    private _size: Vector2 = new Vector2(100, 100);
    get size(): Vector2 { return this._size; }
    set size(value: Vector2) { this._size = value; this.updateUi(); }

    constructor(uid: int, simulator: TableBottomSimulatorClient, content: typeof GameWindowContent) {
        this.uid = uid;
        this.simulator = simulator;
        this.content = content;
    }

    // renderContent(): React.Component {
    //     const content = this.content;
    //     return content;
    // }

    close() {
        this.simulator.windows.remove(this);
    }
}

export abstract class GameWindowContent<P extends { window: GameWindow } = { window: GameWindow }, S = {}, SS = any> extends React.Component<P, S, SS> {

    readonly window: GameWindow;

    constructor(props: P) {
        super(props);
        this.window = props.window;
    }
}