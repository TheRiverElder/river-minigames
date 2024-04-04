import { IsolatedFunction, int } from "../../libs/CommonTypes";
import SimpleTimer from "../../libs/management/SimpleTimer";
import Game from "../model/global/Game";
import { initializeTestGame } from "../test/Test";
import GameActionServerChannel from "./channel/GameActionServerChannel";
import GameControlServerChannel from "./channel/GameControlServerChannel";
import GameQueryServerChannel from "./channel/GameQueryServerChannel";
import GameUpdateServerChannel from "./channel/GameUpdateServerChannel";
import RegistryServerChannel from "./channel/RegistryServerChannel";
import UiServerChannel from "./channel/UiServerChannel";
import ServerScreen, { ServerScreenType } from "../screen/ServerScreen";
import Registry from "../../libs/management/Registry";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import { AssemblerServerScreen } from "./screen/AssemblerServerScreen";
import ChannelManager from "../common/channel/ChannelManager";
import WorkerSideWorkerCommunicationCore from "../common/channel/WorkerSideWorkerCommunicationCore";
import ChannelBase from "../common/channel/ChannelBase";


export interface GameRuntime {
    readonly game: Game;
    readonly timer: SimpleTimer;
    start: IsolatedFunction;
    stop: IsolatedFunction;
    readonly channels: {
        readonly MANAGER: ChannelManager;
        readonly GAME_CONTROL: GameControlServerChannel;
        readonly GAME_UPDATE: GameUpdateServerChannel;
        readonly GAME_QUERY: GameQueryServerChannel;
        readonly GAME_ACTION: GameActionServerChannel;
        readonly GAME_REGISTRY: RegistryServerChannel;
        readonly GAME_UI: UiServerChannel;
    };
    readonly screenTypes: Registry<string, ServerScreenType>;
    readonly screens: Registry<int, ServerScreen>;
    readonly screenUidGenerator: IncrementNumberGenerator;
}

const GAME = initializeTestGame();
// const GAME = new Game();
const TIMER = new SimpleTimer([() => GAME.tick()], 1000 / 20);

GAME.listeners.UI_UPDATE.add(() => runtime.channels.GAME_UPDATE.sendUpdate());

function start() {
    TIMER.start();
}

function stop() {
    TIMER.stop();
}

const runtime: GameRuntime = (function () {
    const r = {
        game: GAME,
        timer: TIMER,
        start,
        stop,
        screenTypes: new Registry<string, ServerScreenType>(it => it.id),
        screens: new Registry<int, ServerScreen>(it => it.uid),
        screenUidGenerator: new IncrementNumberGenerator(0),
    } as any;
    const manager = new ChannelManager(new WorkerSideWorkerCommunicationCore());
    function addChannel<T extends ChannelBase>(channel: T) {
        manager.channels.add(channel);
        return channel;
    }
    const channels: GameRuntime["channels"] = {
        MANAGER: manager,
        GAME_CONTROL: addChannel(new GameControlServerChannel(manager, r)),
        GAME_UPDATE: addChannel(new GameUpdateServerChannel(manager, r)),
        GAME_QUERY: addChannel(new GameQueryServerChannel(manager, r)),
        GAME_ACTION: addChannel(new GameActionServerChannel(manager, r)),
        GAME_REGISTRY: addChannel(new RegistryServerChannel(manager, r)),
        GAME_UI: addChannel(new UiServerChannel(manager, r)),
    };
    r.channels = channels;

    return r;
})();

function initializeChannels() {
    runtime.screenTypes.add(AssemblerServerScreen.TYPE);
}

initializeChannels();

self.addEventListener("close", () => stop());