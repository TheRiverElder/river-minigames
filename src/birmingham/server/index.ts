// import express from "express";
// import expressWS, { Application } from "express-ws";
// import { int } from "../../libs/CommonTypes";
// import { Nullable } from "../../libs/lang/Optional";
// import Game from "../Game";
// import Player from "../Player";
// // import { initializeBirmingham } from "../test";
// import { WebSocket } from "ws";

// let game: Nullable<Game> = null;

// const playerIdToInstanceMap: Map<int, Player> = new Map();
// const playerIdToClientMap: Map<int, WebSocket> = new Map();

// function broadcast(message: string) {
//     Array.from(playerIdToClientMap.values()).forEach(client => client.send(message));
// }

// const rawApp = express();
// expressWS(rawApp);
// const app: Application = rawApp as unknown as Application;

// app.post("/birmingham/initialize", (request, response) => {
//     const playerAmountStr = (request.params as any)["playerAmount"];
//     if (!playerAmountStr) {
//         response.send("No playerAmount!");
//         response.end(400);
//         return;
//     }
//     const playerAmount: int = parseInt(playerAmountStr);
//     game = initializeBirmingham(playerAmount);
//     playerIdToInstanceMap.clear();
//     Array.from(game.players.values()).forEach((player, i) => playerIdToInstanceMap.set(i, player));
//     response.send("Done!");
// });

// app.ws("/birmingham/run", (ws, request) => {
//     const playerId = parseInt(request.params["playerId"]);
//     if (!playerId) ws.close(400, "No playerId!");

//     const player = playerIdToInstanceMap.get(playerId);
//     if (!player) {
//         ws.close(400, `No player with playerId=${playerId}!`);
//         return;
//     }

//     ws.onopen = () => {
//         playerIdToClientMap.set(playerId, ws);
//         broadcast(`${player.name}(#${playerId})加入了游戏`)
//     };

//     ws.onmessage = (event) => {
//         const data: string = event.data.toString();
//         console.log("receive: ", data);
//     };

//     ws.onclose = () => {
//         playerIdToClientMap.delete(playerId);
//         broadcast(`${player.name}(#${playerId})离开了游戏`)
//     };

//     ws.onerror = () => {
        
//     };
// });


// app.listen(8081);


// export {};

export {}