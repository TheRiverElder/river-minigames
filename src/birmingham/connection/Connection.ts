import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";

export default class Connection {
    readonly game: Game;
    readonly url: string;

    private websocket: Nullable<WebSocket> = null;
    private isNextFirstMessage = true;

    constructor(game: Game, url: string) {
        this.game = game;
        this.url = url;
    }

    start() {
        this.websocket = new WebSocket(this.url);
        this.websocket.onopen = () => console.log("Connected!");
        this.websocket.onclose = () => console.log("Disconnected!");
        this.websocket.onerror = (e) => console.log("Error: ", e);
        this.websocket.onmessage = this.onMessage;
    }

    onMessage = (event: MessageEvent) => {
        console.log("Message: ", event.data);
        const json = JSON.parse(event.data);
        if (!json) return;
        if (this.isNextFirstMessage) {
            console.log("初始化开始");
            this.game.initialize(json);
            console.log("初始化完成");
        } else {
            // TODO
            this.game.update();
        }
        this.isNextFirstMessage = false;
            
    }
}