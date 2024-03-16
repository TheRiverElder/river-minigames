import SimpleTimer from "../../libs/management/SimpleTimer";
import Game from "../Game";


const GAME = new Game();
const TIMER = new SimpleTimer([() => GAME.tick()], 1000 / 20);

function start() {
    TIMER.start();
}

function stop() {
    TIMER.stop();
}

function onWorkerMessage(event: MessageEvent<object>) {
    event.data;
    self.postMessage("");
}

self.addEventListener("message", onWorkerMessage);