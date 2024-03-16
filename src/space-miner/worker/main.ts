import Game from "../Game";

const GAME = new Game();

const start() {

}

const stop() {
    
}

function onWorkerMessage(event: MessageEvent<object>) {
    event.data;
}

self.addEventListener("message", onWorkerMessage);