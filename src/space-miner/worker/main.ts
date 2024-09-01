import { IsolatedFunction } from "../../libs/CommonTypes";
import SimpleTimer from "../../libs/management/SimpleTimer";
import Game from "../model/global/Game";
import { initializeTestGame } from "../test/Test";
import GameActionServerChannel from "./channel/GameActionServerChannel";
import GameControlServerChannel from "./channel/GameControlServerChannel";
import GameQueryServerChannel from "./channel/GameQueryServerChannel";
import GameUpdateServerChannel from "./channel/GameUpdateServerChannel";
import RegistryServerChannel from "./channel/RegistryServerChannel";
import UiServerChannel from "./channel/UiServerChannel";
import { AssemblerServerScreen } from "./screen/AssemblerServerScreen";
import ChannelManager from "../common/channel/ChannelManager";
import WorkerSideWorkerCommunicationCore from "../common/channel/WorkerSideWorkerCommunicationCore";
import NamedChannelBase from "../common/channel/NamedChannelBase";
import ContractDraftServerScreen from "./screen/ContractDraftServerScreen";
import ScreenManager from "./screen/ScreenManager";
import ContractsServerScreen from "./screen/ContractsServerScreen";
import DevelopmentCenterServerScreen from "../screen/DevelopmentCenter/DevelopmentCenterServerScreen";
import OrbFullPanelServerScreen from "../screen/OrbFullPanel/OrbFullPanelServerScreen";


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
    readonly screenManager: ScreenManager;
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
        screenManager: new ScreenManager(),
    } as any;
    const manager = new ChannelManager(new WorkerSideWorkerCommunicationCore());
    function addChannel<T extends NamedChannelBase>(channel: T) {
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
    runtime.screenManager.screenTypes.add(AssemblerServerScreen.TYPE);
    runtime.screenManager.screenTypes.add(ContractDraftServerScreen.TYPE);
    runtime.screenManager.screenTypes.add(ContractsServerScreen.TYPE);
    runtime.screenManager.screenTypes.add(DevelopmentCenterServerScreen.TYPE);
    runtime.screenManager.screenTypes.add(OrbFullPanelServerScreen.TYPE);
}

initializeChannels();

self.addEventListener("close", () => stop());