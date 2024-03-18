import { IsolatedFunction } from "../../libs/CommonTypes";
import SimpleTimer from "../../libs/management/SimpleTimer";
import Game from "../Game";
import SpaceMinerChannelManager from "../common/SpaceMinerChannelManager";
import { initializeTestGame } from "../test/Test";
import GameControlServerChannel from "./channel/GameControlServerChannel";
import GameQueryServerChannel from "./channel/GameQueryServerChannel";
import GameUpdateServerChannel from "./channel/GameUpdateServerChannel";
import RegistryServerChannel from "./channel/RegistryServerChannel";
import UiServerChannel from "./channel/UiServerChannel";


export interface GameRuntime {
    readonly game: Game;
    readonly timer: SimpleTimer;
    start: IsolatedFunction;
    stop: IsolatedFunction;
}

const GAME = initializeTestGame();
// const GAME = new Game();
const TIMER = new SimpleTimer([() => GAME.tick()], 1000 / 20);

GAME.listeners.UI_UPDATE.add(() => CHANNEL_GAME_UPDATE.sendGameUpdate());

function start() {
    TIMER.start();
}

function stop() {
    TIMER.stop();
}

const runtime: GameRuntime = {
    game: GAME,
    timer: TIMER,
    start,
    stop,
};

const CHANNEL_MANAGER = new SpaceMinerChannelManager();
const CHANNEL_GAME_CONTROL = new GameControlServerChannel(CHANNEL_MANAGER, runtime);
const CHANNEL_GAME_UPDATE = new GameUpdateServerChannel(CHANNEL_MANAGER, runtime);
const CHANNEL_GAME_QUERY = new GameQueryServerChannel(CHANNEL_MANAGER, runtime);
const CHANNEL_GAME_REGISTRY = new RegistryServerChannel(CHANNEL_MANAGER, runtime);
const CHANNEL_GAME_UI = new UiServerChannel(CHANNEL_MANAGER, runtime);

CHANNEL_MANAGER.channels.add(CHANNEL_GAME_CONTROL);
CHANNEL_MANAGER.channels.add(CHANNEL_GAME_UPDATE);
CHANNEL_MANAGER.channels.add(CHANNEL_GAME_QUERY);
CHANNEL_MANAGER.channels.add(CHANNEL_GAME_REGISTRY);
CHANNEL_MANAGER.channels.add(CHANNEL_GAME_UI);

function onWorkerMessage(event: MessageEvent<object>) {
    // console.log(event.data);
}

self.addEventListener("message", onWorkerMessage);
self.addEventListener("close", () => stop());