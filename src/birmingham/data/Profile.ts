import GameState from "../GameState";
import GameStateIdle from "../gamestate/GameStateIdle";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import Track from "./Track";

export default class Profile {
    readonly uid: number;
    name: string = "";

    cards: Array<string> = [];
    factorySlots = new Map<string, Array<FactorySlot>>(); // [Industry, factories]
    money: number = 0;
    costCoinCounter: number = 0;
    goals: number = 0;
    income: Track = new Track();

    ordinal: number = -1;
    actionCounter: number = 0;
    state: GameState = new GameStateIdle({} as any);

    constructor(uid: number) {
        this.uid = uid;
    }
    
    static load(data: any, game: Game): Profile {
        const profile = new Profile(data.uid);
        profile.name = data.name;
        profile.cards = data.cards;
        profile.factorySlots = new Map(data.factorySlots.map(([industory, slotsData]: any) => [industory, slotsData.map((d: any) => FactorySlot.load(d, game))]));
        profile.costCoinCounter = data.costCoinCounter;
        profile.goals = data.goals;
        profile.income = data.income;
        profile.ordinal = data.ordinal;
        profile.actionCounter = data.actionCounter;
        return profile;
    }
}