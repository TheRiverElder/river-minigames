import express from "express";
import expressWS, { Application } from "express-ws";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Player from "../Player";

const game: Nullable<Game> = null;

const playerIdToInstanceMap: Map<string, Player> = new Map();

const rawApp = express();
expressWS(rawApp);
const app: Application = rawApp as unknown as Application;


app.ws("/birmingham", (ws, request) => {

    const playerId = request.params["playerId"];
    if (!playerId) ws.close(400, "No playerId!");

    ws.onmessage = (event) => {
        const data: string = event.data.toString();
        console.log("receive: ", data);
    };
});


app.listen(8081);


export {};

