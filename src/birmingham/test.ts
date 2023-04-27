import Vector2 from "../libs/math/Vector2";
import City from "./City";
import Game from "./Game";
import GameMap from "./GameMap";
import { createCoalMarket, createIronMarket } from "./Market";
import Player from "./Player";
import { RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON } from "./ResourceType";


export function initializeBirmingham(): [Game, Player] {

    const cityBirmingham = new City("Birmingham", new Vector2(500, 500), [], [], null);
    const cityShrewsbury = new City("Shrewsbury", new Vector2(100, 400), [], [], null);
    const cityCoalbrookdale = new City("Coalbrookdale", new Vector2(200, 400), [], [], null);
    const cityWolverhampton = new City("Wolverhampton", new Vector2(300, 400), [], [], null);
    const cityWalsell = new City("Walsell", new Vector2(400, 400), [], [], null);
    const cityTamworth = new City("Tamworth", new Vector2(600, 400), [], [], null);
    const cityNuneaton = new City("Nuneaton", new Vector2(600, 500), [], [], null);
    const cityCoventry = new City("Coventry", new Vector2(600, 600), [], [], null);
    const cityOxford = new City("Oxford", new Vector2(600, 700), [], [], null);
    const cityRedditch = new City("Redditch", new Vector2(500, 700), [], [], null);
    const cityGloucester = new City("Gloucester", new Vector2(400, 700), [], [], null);
    const cityWorcester = new City("Worcester", new Vector2(300, 700), [], [], null);
    const cityKidderminster = new City("Kidderminster", new Vector2(200, 600), [], [], null);
    const cityDudley = new City("Dudley", new Vector2(400, 500), [], [], null);

    const gameMap: GameMap = new GameMap(
        new Vector2(1600, 1200),
        [
            cityBirmingham,
            cityShrewsbury,
            cityCoalbrookdale,
            cityWolverhampton,
            cityWalsell,
            cityTamworth,
            cityNuneaton,
            cityCoventry,
            cityOxford,
            cityRedditch,
            cityGloucester,
            cityWorcester,
            cityKidderminster,
            cityDudley,
        ],
        [

        ],
    );

    const game: Game = new Game(
        gameMap,
        [],
        new Map([
            [RESOURCE_TYPE_COAL, createCoalMarket()],
            [RESOURCE_TYPE_IRON, createIronMarket()],
        ]),
        0,
    );


    const player: Player = new Player(game, "Bennelamudelder", 0, 0, 0, [], []);

    game.players.push(player);

    return [game, player];
}