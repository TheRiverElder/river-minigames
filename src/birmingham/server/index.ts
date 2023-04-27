import express from "express";
import expressWS, { Application } from "express-ws";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Player from "../Player";
import { initializeBirmingham } from "../test";

let game: Nullable<Game> = null;

const playerIdToInstanceMap: Map<string, Player> = new Map();

const rawApp = express();
expressWS(rawApp);
const app: Application = rawApp as unknown as Application;

app.post("/birmingham/initialize", (request, response) => {
    const playerAmountStr = (request.params as any)["playerAmount"];
    if (!playerAmountStr) {
        response.send("No playerAmount!");
        response.end(400);
        return;
    }
    const playerAmount: int = parseInt(playerAmountStr);
    game = initializeBirmingham(playerAmount);
    response.send("Done!");
});

app.ws("/birmingham/run", (ws, request) => {
    const playerId = request.params["playerId"];
    if (!playerId) ws.close(400, "No playerId!");

    ws.onmessage = (event) => {
        const data: string = event.data.toString();
        console.log("receive: ", data);
    };
});


app.listen(8081);


export {};

