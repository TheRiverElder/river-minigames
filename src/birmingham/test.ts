// import { int } from "../libs/CommonTypes";
// import { createArray } from "../libs/lang/Collections";
// import Vector2 from "../libs/math/Vector2";
// import City from "./City";
// import Game from "./Game";
// import GameMap from "./GameMap";
// import Market, { createCoalMarket, createIronMarket } from "./Market";
// import Player from "./Player";
// import ResourceType, { RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON } from "./ResourceType";
// import Traffic from "./traffic/Traffic";
// import { TRAFFIC_TYPE_CANAL } from "./traffic/TrafficType";


// export function initializeBirmingham(playerAmount: int): Game {

//     const cityBirmingham = new City("Birmingham", new Vector2(500, 500), [], [], null);
//     const cityShrewsbury = new City("Shrewsbury", new Vector2(100, 400), [], [], null);
//     const cityCoalbrookdale = new City("Coalbrookdale", new Vector2(200, 400), [], [], null);
//     const cityWolverhampton = new City("Wolverhampton", new Vector2(300, 400), [], [], null);
//     const cityWalsell = new City("Walsell", new Vector2(400, 400), [], [], null);
//     const cityTamworth = new City("Tamworth", new Vector2(600, 400), [], [], null);
//     const cityNuneaton = new City("Nuneaton", new Vector2(600, 500), [], [], null);
//     const cityCoventry = new City("Coventry", new Vector2(600, 600), [], [], null);
//     const cityOxford = new City("Oxford", new Vector2(600, 700), [], [], null);
//     const cityRedditch = new City("Redditch", new Vector2(500, 700), [], [], null);
//     const cityGloucester = new City("Gloucester", new Vector2(400, 700), [], [], null);
//     const cityWorcester = new City("Worcester", new Vector2(300, 700), [], [], null);
//     const cityKidderminster = new City("Kidderminster", new Vector2(200, 600), [], [], null);
//     const cityDudley = new City("Dudley", new Vector2(400, 500), [], [], null);

//     const gameMap: GameMap = new GameMap(
//         new Vector2(1600, 1200),
//         new Vector2(100, 100),
//         [
//             cityBirmingham,
//             cityShrewsbury,
//             cityCoalbrookdale,
//             cityWolverhampton,
//             cityWalsell,
//             cityTamworth,
//             cityNuneaton,
//             cityCoventry,
//             cityOxford,
//             cityRedditch,
//             cityGloucester,
//             cityWorcester,
//             cityKidderminster,
//             cityDudley,
//         ],
//         []
//     );

//     const game: Game = new Game(
//         gameMap,
//         [],
//         new Map(),
//         0,
//     );

//     const traffics = [
//         new Traffic(game, TRAFFIC_TYPE_CANAL, new Vector2(150, 400), cityShrewsbury, cityCoalbrookdale, null),
//     ];
//     gameMap.traffics.push(...traffics);
//     gameMap.reconnectTraffics();


//     const markets: Array<[ResourceType, Market]> = [
//         [RESOURCE_TYPE_COAL, createCoalMarket(game)],
//         [RESOURCE_TYPE_IRON, createIronMarket(game)],
//     ];
//     markets.forEach(([rt, m]) => game.markets.set(rt, m));


//     const players = createArray(playerAmount, (i) => new Player(game, "player-" + i.toString(), 0, 0, 0, [], []));

//     game.players.add(...players);
//     game.recalculateTurn();

//     return game;
// }

export const TEST_DATA = {
	"markets": [{
		"uid": 1,
		"resourceType": "coal",
		"capacityLevel": 8,
		"amount": 13
	}, {
		"uid": 2,
		"resourceType": "iron",
		"capacityLevel": 6,
		"amount": 8
	}],
	"factories": [],
	"players": [{
		"uid": 72,
		"name": "player-0",
		"income": 0,
		"account": 0,
		"score": 0,
		"cost": 0,
		"factorySlots": [],
		"cards": []
	}, {
		"uid": 73,
		"name": "player-1",
		"income": 0,
		"account": 0,
		"score": 0,
		"cost": 0,
		"factorySlots": [],
		"cards": []
	}],
	"map": {
		"cities": [{
			"name": "Wolverhampton",
			"industrySlots": [{
				"uid": 12,
				"position": {
					"x": 2563.0,
					"y": 3147.0
				},
				"industries": ["manufacturer", "coal_mine"],
				"factory": -1
			}, {
				"uid": 11,
				"position": {
					"x": 2377.0,
					"y": 3147.0
				},
				"industries": ["manufacturer"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 37,
				"type": "rail",
				"position": {
					"x": 2201.1666666666665,
					"y": 3202.0
				},
				"head": "Coalbrookdale",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 55,
				"type": "rail",
				"position": {
					"x": 2567.5,
					"y": 3389.5
				},
				"head": "Dudley",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 38,
				"type": "canal",
				"position": {
					"x": 2791.0,
					"y": 3190.0
				},
				"head": "Wolverhampton",
				"tail": "Walsell",
				"owner": -1
			}, {
				"uid": 39,
				"type": "rail",
				"position": {
					"x": 2791.0,
					"y": 3190.0
				},
				"head": "Wolverhampton",
				"tail": "Walsell",
				"owner": -1
			}, {
				"uid": 54,
				"type": "canal",
				"position": {
					"x": 2567.5,
					"y": 3389.5
				},
				"head": "Dudley",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 36,
				"type": "canal",
				"position": {
					"x": 2201.1666666666665,
					"y": 3202.0
				},
				"head": "Coalbrookdale",
				"tail": "Wolverhampton",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Dudley",
			"industrySlots": [{
				"uid": 32,
				"position": {
					"x": 2588.0,
					"y": 3632.0
				},
				"industries": ["coal_mine"],
				"factory": -1
			}, {
				"uid": 33,
				"position": {
					"x": 2742.0,
					"y": 3632.0
				},
				"industries": ["iron_works"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 52,
				"type": "canal",
				"position": {
					"x": 2518.0,
					"y": 3842.0
				},
				"head": "Kidderminster",
				"tail": "Dudley",
				"owner": -1
			}, {
				"uid": 70,
				"type": "canal",
				"position": {
					"x": 3083.5,
					"y": 3689.75
				},
				"head": "Dudley",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 55,
				"type": "rail",
				"position": {
					"x": 2567.5,
					"y": 3389.5
				},
				"head": "Dudley",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 53,
				"type": "rail",
				"position": {
					"x": 2518.0,
					"y": 3842.0
				},
				"head": "Kidderminster",
				"tail": "Dudley",
				"owner": -1
			}, {
				"uid": 54,
				"type": "canal",
				"position": {
					"x": 2567.5,
					"y": 3389.5
				},
				"head": "Dudley",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 71,
				"type": "rail",
				"position": {
					"x": 3083.5,
					"y": 3689.75
				},
				"head": "Dudley",
				"tail": "Birmingham",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Coalbrookdale",
			"industrySlots": [{
				"uid": 9,
				"position": {
					"x": 2007.0,
					"y": 3319.0
				},
				"industries": ["coal_mine"],
				"factory": -1
			}, {
				"uid": 8,
				"position": {
					"x": 1879.0,
					"y": 3319.0
				},
				"industries": ["iron_works"],
				"factory": -1
			}, {
				"uid": 10,
				"position": {
					"x": 1911.0,
					"y": 3133.0
				},
				"industries": ["iron_works", "brewery"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 37,
				"type": "rail",
				"position": {
					"x": 2201.1666666666665,
					"y": 3202.0
				},
				"head": "Coalbrookdale",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 34,
				"type": "canal",
				"position": {
					"x": 1634.6666666666665,
					"y": 3298.0
				},
				"head": "Shrewsbury",
				"tail": "Coalbrookdale",
				"owner": -1
			}, {
				"uid": 35,
				"type": "rail",
				"position": {
					"x": 1634.6666666666665,
					"y": 3298.0
				},
				"head": "Shrewsbury",
				"tail": "Coalbrookdale",
				"owner": -1
			}, {
				"uid": 57,
				"type": "rail",
				"position": {
					"x": 2151.6666666666665,
					"y": 3654.5
				},
				"head": "Coalbrookdale",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 36,
				"type": "canal",
				"position": {
					"x": 2201.1666666666665,
					"y": 3202.0
				},
				"head": "Coalbrookdale",
				"tail": "Wolverhampton",
				"owner": -1
			}, {
				"uid": 56,
				"type": "canal",
				"position": {
					"x": 2151.6666666666665,
					"y": 3654.5
				},
				"head": "Coalbrookdale",
				"tail": "Kidderminster",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Coventry",
			"industrySlots": [{
				"uid": 19,
				"position": {
					"x": 4139.0,
					"y": 3919.0
				},
				"industries": ["manufacturer", "coal_mine"],
				"factory": -1
			}, {
				"uid": 20,
				"position": {
					"x": 4327.0,
					"y": 3919.0
				},
				"industries": ["iron_works", "manufacturer"],
				"factory": -1
			}, {
				"uid": 21,
				"position": {
					"x": 4233.0,
					"y": 3729.0
				},
				"industries": ["pottery"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 43,
				"type": "rail",
				"position": {
					"x": 4186.0,
					"y": 3623.333333333333
				},
				"head": "Nuneaton",
				"tail": "Coventry",
				"owner": -1
			}, {
				"uid": 63,
				"type": "canal",
				"position": {
					"x": 3867.5,
					"y": 3801.583333333333
				},
				"head": "Coventry",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 64,
				"type": "rail",
				"position": {
					"x": 3867.5,
					"y": 3801.583333333333
				},
				"head": "Coventry",
				"tail": "Birmingham",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Birmingham",
			"industrySlots": [{
				"uid": 3,
				"position": {
					"x": 3410.0,
					"y": 3795.0
				},
				"industries": ["iron_works"],
				"factory": -1
			}, {
				"uid": 4,
				"position": {
					"x": 3594.0,
					"y": 3795.0
				},
				"industries": ["manufacturer"],
				"factory": -1
			}, {
				"uid": 5,
				"position": {
					"x": 3410.0,
					"y": 3605.0
				},
				"industries": ["cotton_mill", "manufacturer"],
				"factory": -1
			}, {
				"uid": 6,
				"position": {
					"x": 3594.0,
					"y": 3795.0
				},
				"industries": ["manufacturer"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 60,
				"type": "canal",
				"position": {
					"x": 3637.25,
					"y": 3364.25
				},
				"head": "Tamworth",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 65,
				"type": "canal",
				"position": {
					"x": 3896.0,
					"y": 4072.75
				},
				"head": "Oxford",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 70,
				"type": "canal",
				"position": {
					"x": 3083.5,
					"y": 3689.75
				},
				"head": "Dudley",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 62,
				"type": "rail",
				"position": {
					"x": 3820.5,
					"y": 3569.25
				},
				"head": "Nuneaton",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 64,
				"type": "rail",
				"position": {
					"x": 3867.5,
					"y": 3801.583333333333
				},
				"head": "Coventry",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 67,
				"type": "rail",
				"position": {
					"x": 3416.5,
					"y": 4005.75
				},
				"head": "Redditch",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 71,
				"type": "rail",
				"position": {
					"x": 3083.5,
					"y": 3689.75
				},
				"head": "Dudley",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 59,
				"type": "rail",
				"position": {
					"x": 3307.0,
					"y": 3490.25
				},
				"head": "Walsell",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 68,
				"type": "canal",
				"position": {
					"x": 2966.5,
					"y": 4157.75
				},
				"head": "Worcester",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 61,
				"type": "rail",
				"position": {
					"x": 3637.25,
					"y": 3364.25
				},
				"head": "Tamworth",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 66,
				"type": "rail",
				"position": {
					"x": 3896.0,
					"y": 4072.75
				},
				"head": "Oxford",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 63,
				"type": "canal",
				"position": {
					"x": 3867.5,
					"y": 3801.583333333333
				},
				"head": "Coventry",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 69,
				"type": "rail",
				"position": {
					"x": 2966.5,
					"y": 4157.75
				},
				"head": "Worcester",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 58,
				"type": "canal",
				"position": {
					"x": 3307.0,
					"y": 3490.25
				},
				"head": "Walsell",
				"tail": "Birmingham",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Tamworth",
			"industrySlots": [{
				"uid": 15,
				"position": {
					"x": 3685.0,
					"y": 2981.0
				},
				"industries": ["cotton_mill", "coal_mine"],
				"factory": -1
			}, {
				"uid": 16,
				"position": {
					"x": 3860.0,
					"y": 2981.0
				},
				"industries": ["cotton_mill", "coal_mine"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 60,
				"type": "canal",
				"position": {
					"x": 3637.25,
					"y": 3364.25
				},
				"head": "Tamworth",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 61,
				"type": "rail",
				"position": {
					"x": 3637.25,
					"y": 3364.25
				},
				"head": "Tamworth",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 40,
				"type": "rail",
				"position": {
					"x": 3442.25,
					"y": 3107.0
				},
				"head": "Walsell",
				"tail": "Tamworth",
				"owner": -1
			}, {
				"uid": 41,
				"type": "canal",
				"position": {
					"x": 3955.75,
					"y": 3186.0
				},
				"head": "Tamworth",
				"tail": "Nuneaton",
				"owner": -1
			}, {
				"uid": 42,
				"type": "rail",
				"position": {
					"x": 3955.75,
					"y": 3186.0
				},
				"head": "Tamworth",
				"tail": "Nuneaton",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Redditch",
			"industrySlots": [{
				"uid": 25,
				"position": {
					"x": 3441.0,
					"y": 4264.0
				},
				"industries": ["iron_works"],
				"factory": -1
			}, {
				"uid": 24,
				"position": {
					"x": 3221.0,
					"y": 4264.0
				},
				"industries": ["manufacturer", "coal_mine"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 44,
				"type": "canal",
				"position": {
					"x": 3810.5,
					"y": 4331.0
				},
				"head": "Oxford",
				"tail": "Redditch",
				"owner": -1
			}, {
				"uid": 45,
				"type": "rail",
				"position": {
					"x": 3810.5,
					"y": 4331.0
				},
				"head": "Oxford",
				"tail": "Redditch",
				"owner": -1
			}, {
				"uid": 47,
				"type": "rail",
				"position": {
					"x": 3365.0,
					"y": 4482.0
				},
				"head": "Redditch",
				"tail": "Gloucester",
				"owner": -1
			}, {
				"uid": 67,
				"type": "rail",
				"position": {
					"x": 3416.5,
					"y": 4005.75
				},
				"head": "Redditch",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 46,
				"type": "canal",
				"position": {
					"x": 3365.0,
					"y": 4482.0
				},
				"head": "Redditch",
				"tail": "Gloucester",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Shrewsbury",
			"industrySlots": [{
				"uid": 7,
				"position": {
					"x": 1337.0,
					"y": 3339.0
				},
				"industries": [],
				"factory": -1
			}],
			"traffics": [{
				"uid": 34,
				"type": "canal",
				"position": {
					"x": 1634.6666666666665,
					"y": 3298.0
				},
				"head": "Shrewsbury",
				"tail": "Coalbrookdale",
				"owner": -1
			}, {
				"uid": 35,
				"type": "rail",
				"position": {
					"x": 1634.6666666666665,
					"y": 3298.0
				},
				"head": "Shrewsbury",
				"tail": "Coalbrookdale",
				"owner": -1
			}],
			"market": 1
		}, {
			"name": "Worcester",
			"industrySlots": [{
				"uid": 28,
				"position": {
					"x": 2332.0,
					"y": 4568.0
				},
				"industries": ["cotton_mill"],
				"factory": -1
			}, {
				"uid": 29,
				"position": {
					"x": 2530.0,
					"y": 4568.0
				},
				"industries": ["cotton_mill"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 68,
				"type": "canal",
				"position": {
					"x": 2966.5,
					"y": 4157.75
				},
				"head": "Worcester",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 49,
				"type": "rail",
				"position": {
					"x": 2915.0,
					"y": 4634.0
				},
				"head": "Gloucester",
				"tail": "Worcester",
				"owner": -1
			}, {
				"uid": 69,
				"type": "rail",
				"position": {
					"x": 2966.5,
					"y": 4157.75
				},
				"head": "Worcester",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 50,
				"type": "canal",
				"position": {
					"x": 2401.0,
					"y": 4310.0
				},
				"head": "Worcester",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 51,
				"type": "rail",
				"position": {
					"x": 2401.0,
					"y": 4310.0
				},
				"head": "Worcester",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 48,
				"type": "canal",
				"position": {
					"x": 2915.0,
					"y": 4634.0
				},
				"head": "Gloucester",
				"tail": "Worcester",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Nuneaton",
			"industrySlots": [{
				"uid": 17,
				"position": {
					"x": 4047.0,
					"y": 3391.0
				},
				"industries": ["manufacturer", "brewery"],
				"factory": -1
			}, {
				"uid": 18,
				"position": {
					"x": 4231.0,
					"y": 3391.0
				},
				"industries": ["cotton_mill", "coal_mine"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 43,
				"type": "rail",
				"position": {
					"x": 4186.0,
					"y": 3623.333333333333
				},
				"head": "Nuneaton",
				"tail": "Coventry",
				"owner": -1
			}, {
				"uid": 41,
				"type": "canal",
				"position": {
					"x": 3955.75,
					"y": 3186.0
				},
				"head": "Tamworth",
				"tail": "Nuneaton",
				"owner": -1
			}, {
				"uid": 62,
				"type": "rail",
				"position": {
					"x": 3820.5,
					"y": 3569.25
				},
				"head": "Nuneaton",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 42,
				"type": "rail",
				"position": {
					"x": 3955.75,
					"y": 3186.0
				},
				"head": "Tamworth",
				"tail": "Nuneaton",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Gloucester",
			"industrySlots": [{
				"uid": 26,
				"position": {
					"x": 3308.0,
					"y": 4700.0
				},
				"industries": [],
				"factory": -1
			}, {
				"uid": 27,
				"position": {
					"x": 3490.0,
					"y": 4700.0
				},
				"industries": [],
				"factory": -1
			}],
			"traffics": [{
				"uid": 47,
				"type": "rail",
				"position": {
					"x": 3365.0,
					"y": 4482.0
				},
				"head": "Redditch",
				"tail": "Gloucester",
				"owner": -1
			}, {
				"uid": 49,
				"type": "rail",
				"position": {
					"x": 2915.0,
					"y": 4634.0
				},
				"head": "Gloucester",
				"tail": "Worcester",
				"owner": -1
			}, {
				"uid": 48,
				"type": "canal",
				"position": {
					"x": 2915.0,
					"y": 4634.0
				},
				"head": "Gloucester",
				"tail": "Worcester",
				"owner": -1
			}, {
				"uid": 46,
				"type": "canal",
				"position": {
					"x": 3365.0,
					"y": 4482.0
				},
				"head": "Redditch",
				"tail": "Gloucester",
				"owner": -1
			}],
			"market": 1
		}, {
			"name": "Kidderminster",
			"industrySlots": [{
				"uid": 31,
				"position": {
					"x": 2464.0,
					"y": 4052.0
				},
				"industries": ["cotton_mill"],
				"factory": -1
			}, {
				"uid": 30,
				"position": {
					"x": 2278.0,
					"y": 4052.0
				},
				"industries": ["cotton_mill", "coal_mine"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 52,
				"type": "canal",
				"position": {
					"x": 2518.0,
					"y": 3842.0
				},
				"head": "Kidderminster",
				"tail": "Dudley",
				"owner": -1
			}, {
				"uid": 53,
				"type": "rail",
				"position": {
					"x": 2518.0,
					"y": 3842.0
				},
				"head": "Kidderminster",
				"tail": "Dudley",
				"owner": -1
			}, {
				"uid": 57,
				"type": "rail",
				"position": {
					"x": 2151.6666666666665,
					"y": 3654.5
				},
				"head": "Coalbrookdale",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 50,
				"type": "canal",
				"position": {
					"x": 2401.0,
					"y": 4310.0
				},
				"head": "Worcester",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 51,
				"type": "rail",
				"position": {
					"x": 2401.0,
					"y": 4310.0
				},
				"head": "Worcester",
				"tail": "Kidderminster",
				"owner": -1
			}, {
				"uid": 56,
				"type": "canal",
				"position": {
					"x": 2151.6666666666665,
					"y": 3654.5
				},
				"head": "Coalbrookdale",
				"tail": "Kidderminster",
				"owner": -1
			}],
			"market": -1
		}, {
			"name": "Oxford",
			"industrySlots": [{
				"uid": 22,
				"position": {
					"x": 4197.0,
					"y": 4398.0
				},
				"industries": [],
				"factory": -1
			}, {
				"uid": 23,
				"position": {
					"x": 4383.0,
					"y": 4398.0
				},
				"industries": [],
				"factory": -1
			}],
			"traffics": [{
				"uid": 65,
				"type": "canal",
				"position": {
					"x": 3896.0,
					"y": 4072.75
				},
				"head": "Oxford",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 44,
				"type": "canal",
				"position": {
					"x": 3810.5,
					"y": 4331.0
				},
				"head": "Oxford",
				"tail": "Redditch",
				"owner": -1
			}, {
				"uid": 66,
				"type": "rail",
				"position": {
					"x": 3896.0,
					"y": 4072.75
				},
				"head": "Oxford",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 45,
				"type": "rail",
				"position": {
					"x": 3810.5,
					"y": 4331.0
				},
				"head": "Oxford",
				"tail": "Redditch",
				"owner": -1
			}],
			"market": 1
		}, {
			"name": "Walsell",
			"industrySlots": [{
				"uid": 13,
				"position": {
					"x": 3021.0,
					"y": 3233.0
				},
				"industries": ["iron_works", "manufacturer"],
				"factory": -1
			}, {
				"uid": 14,
				"position": {
					"x": 3203.0,
					"y": 3233.0
				},
				"industries": ["manufacturer", "brewery"],
				"factory": -1
			}],
			"traffics": [{
				"uid": 40,
				"type": "rail",
				"position": {
					"x": 3442.25,
					"y": 3107.0
				},
				"head": "Walsell",
				"tail": "Tamworth",
				"owner": -1
			}, {
				"uid": 38,
				"type": "canal",
				"position": {
					"x": 2791.0,
					"y": 3190.0
				},
				"head": "Wolverhampton",
				"tail": "Walsell",
				"owner": -1
			}, {
				"uid": 39,
				"type": "rail",
				"position": {
					"x": 2791.0,
					"y": 3190.0
				},
				"head": "Wolverhampton",
				"tail": "Walsell",
				"owner": -1
			}, {
				"uid": 58,
				"type": "canal",
				"position": {
					"x": 3307.0,
					"y": 3490.25
				},
				"head": "Walsell",
				"tail": "Birmingham",
				"owner": -1
			}, {
				"uid": 59,
				"type": "rail",
				"position": {
					"x": 3307.0,
					"y": 3490.25
				},
				"head": "Walsell",
				"tail": "Birmingham",
				"owner": -1
			}],
			"market": -1
		}],
		"traffics": [{
			"uid": 34,
			"type": "canal",
			"position": {
				"x": 1634.6666666666665,
				"y": 3298.0
			},
			"head": "Shrewsbury",
			"tail": "Coalbrookdale",
			"owner": -1
		}, {
			"uid": 35,
			"type": "rail",
			"position": {
				"x": 1634.6666666666665,
				"y": 3298.0
			},
			"head": "Shrewsbury",
			"tail": "Coalbrookdale",
			"owner": -1
		}, {
			"uid": 36,
			"type": "canal",
			"position": {
				"x": 2201.1666666666665,
				"y": 3202.0
			},
			"head": "Coalbrookdale",
			"tail": "Wolverhampton",
			"owner": -1
		}, {
			"uid": 37,
			"type": "rail",
			"position": {
				"x": 2201.1666666666665,
				"y": 3202.0
			},
			"head": "Coalbrookdale",
			"tail": "Wolverhampton",
			"owner": -1
		}, {
			"uid": 38,
			"type": "canal",
			"position": {
				"x": 2791.0,
				"y": 3190.0
			},
			"head": "Wolverhampton",
			"tail": "Walsell",
			"owner": -1
		}, {
			"uid": 39,
			"type": "rail",
			"position": {
				"x": 2791.0,
				"y": 3190.0
			},
			"head": "Wolverhampton",
			"tail": "Walsell",
			"owner": -1
		}, {
			"uid": 40,
			"type": "rail",
			"position": {
				"x": 3442.25,
				"y": 3107.0
			},
			"head": "Walsell",
			"tail": "Tamworth",
			"owner": -1
		}, {
			"uid": 41,
			"type": "canal",
			"position": {
				"x": 3955.75,
				"y": 3186.0
			},
			"head": "Tamworth",
			"tail": "Nuneaton",
			"owner": -1
		}, {
			"uid": 42,
			"type": "rail",
			"position": {
				"x": 3955.75,
				"y": 3186.0
			},
			"head": "Tamworth",
			"tail": "Nuneaton",
			"owner": -1
		}, {
			"uid": 43,
			"type": "rail",
			"position": {
				"x": 4186.0,
				"y": 3623.333333333333
			},
			"head": "Nuneaton",
			"tail": "Coventry",
			"owner": -1
		}, {
			"uid": 44,
			"type": "canal",
			"position": {
				"x": 3810.5,
				"y": 4331.0
			},
			"head": "Oxford",
			"tail": "Redditch",
			"owner": -1
		}, {
			"uid": 45,
			"type": "rail",
			"position": {
				"x": 3810.5,
				"y": 4331.0
			},
			"head": "Oxford",
			"tail": "Redditch",
			"owner": -1
		}, {
			"uid": 46,
			"type": "canal",
			"position": {
				"x": 3365.0,
				"y": 4482.0
			},
			"head": "Redditch",
			"tail": "Gloucester",
			"owner": -1
		}, {
			"uid": 47,
			"type": "rail",
			"position": {
				"x": 3365.0,
				"y": 4482.0
			},
			"head": "Redditch",
			"tail": "Gloucester",
			"owner": -1
		}, {
			"uid": 48,
			"type": "canal",
			"position": {
				"x": 2915.0,
				"y": 4634.0
			},
			"head": "Gloucester",
			"tail": "Worcester",
			"owner": -1
		}, {
			"uid": 49,
			"type": "rail",
			"position": {
				"x": 2915.0,
				"y": 4634.0
			},
			"head": "Gloucester",
			"tail": "Worcester",
			"owner": -1
		}, {
			"uid": 50,
			"type": "canal",
			"position": {
				"x": 2401.0,
				"y": 4310.0
			},
			"head": "Worcester",
			"tail": "Kidderminster",
			"owner": -1
		}, {
			"uid": 51,
			"type": "rail",
			"position": {
				"x": 2401.0,
				"y": 4310.0
			},
			"head": "Worcester",
			"tail": "Kidderminster",
			"owner": -1
		}, {
			"uid": 52,
			"type": "canal",
			"position": {
				"x": 2518.0,
				"y": 3842.0
			},
			"head": "Kidderminster",
			"tail": "Dudley",
			"owner": -1
		}, {
			"uid": 53,
			"type": "rail",
			"position": {
				"x": 2518.0,
				"y": 3842.0
			},
			"head": "Kidderminster",
			"tail": "Dudley",
			"owner": -1
		}, {
			"uid": 54,
			"type": "canal",
			"position": {
				"x": 2567.5,
				"y": 3389.5
			},
			"head": "Dudley",
			"tail": "Wolverhampton",
			"owner": -1
		}, {
			"uid": 55,
			"type": "rail",
			"position": {
				"x": 2567.5,
				"y": 3389.5
			},
			"head": "Dudley",
			"tail": "Wolverhampton",
			"owner": -1
		}, {
			"uid": 56,
			"type": "canal",
			"position": {
				"x": 2151.6666666666665,
				"y": 3654.5
			},
			"head": "Coalbrookdale",
			"tail": "Kidderminster",
			"owner": -1
		}, {
			"uid": 57,
			"type": "rail",
			"position": {
				"x": 2151.6666666666665,
				"y": 3654.5
			},
			"head": "Coalbrookdale",
			"tail": "Kidderminster",
			"owner": -1
		}, {
			"uid": 58,
			"type": "canal",
			"position": {
				"x": 3307.0,
				"y": 3490.25
			},
			"head": "Walsell",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 59,
			"type": "rail",
			"position": {
				"x": 3307.0,
				"y": 3490.25
			},
			"head": "Walsell",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 60,
			"type": "canal",
			"position": {
				"x": 3637.25,
				"y": 3364.25
			},
			"head": "Tamworth",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 61,
			"type": "rail",
			"position": {
				"x": 3637.25,
				"y": 3364.25
			},
			"head": "Tamworth",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 62,
			"type": "rail",
			"position": {
				"x": 3820.5,
				"y": 3569.25
			},
			"head": "Nuneaton",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 63,
			"type": "canal",
			"position": {
				"x": 3867.5,
				"y": 3801.583333333333
			},
			"head": "Coventry",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 64,
			"type": "rail",
			"position": {
				"x": 3867.5,
				"y": 3801.583333333333
			},
			"head": "Coventry",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 65,
			"type": "canal",
			"position": {
				"x": 3896.0,
				"y": 4072.75
			},
			"head": "Oxford",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 66,
			"type": "rail",
			"position": {
				"x": 3896.0,
				"y": 4072.75
			},
			"head": "Oxford",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 67,
			"type": "rail",
			"position": {
				"x": 3416.5,
				"y": 4005.75
			},
			"head": "Redditch",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 68,
			"type": "canal",
			"position": {
				"x": 2966.5,
				"y": 4157.75
			},
			"head": "Worcester",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 69,
			"type": "rail",
			"position": {
				"x": 2966.5,
				"y": 4157.75
			},
			"head": "Worcester",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 70,
			"type": "canal",
			"position": {
				"x": 3083.5,
				"y": 3689.75
			},
			"head": "Dudley",
			"tail": "Birmingham",
			"owner": -1
		}, {
			"uid": 71,
			"type": "rail",
			"position": {
				"x": 3083.5,
				"y": 3689.75
			},
			"head": "Dudley",
			"tail": "Birmingham",
			"owner": -1
		}],
		"size": {
			"x": 6144.0,
			"y": 6144.0
		},
		"industrySlotSize": {
			"x": 100.0,
			"y": 100.0
		}
	},
	"industries": [{
		"name": "pottery"
	}, {
		"name": "coal_mine"
	}, {
		"name": "brewery"
	}, {
		"name": "<empty>"
	}, {
		"name": "*"
	}, {
		"name": "cotton_mill"
	}, {
		"name": "iron_works"
	}, {
		"name": "manufacturer"
	}],
	"resourceTypes": [{
		"name": "<empty>"
	}, {
		"name": "iron"
	}, {
		"name": "coal"
	}, {
		"name": "traffic_goal"
	}, {
		"name": "beer"
	}, {
		"name": "coin"
	}, {
		"name": "factory_goal"
	}],
	"trafficTypes": [{
		"name": "rail",
		"costsByAmount": [
			[
				["coin", 5],
				["coal", 1]
			],
			[
				["coin", 15],
				["coin", 2],
				["beer", 1]
			]
		]
	}, {
		"name": "canal",
		"costsByAmount": [
			[
				["coin", 3]
			]
		]
	}],
	"playersInOrder": [72, 73],
	"turnIndex": 0
};