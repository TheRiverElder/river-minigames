import { int } from "../libs/CommonTypes";
import Action from "./action/Action";
import { ACTION_TYPE_EMPTY } from "./action/ActionType";
import Card from "./Card";
import FactorySlot from "./FactorySlot";
import Game from "./Game";

export default class Player {
    readonly game: Game;
    readonly name: string;
    income: int;
    account: int;
    score: int;
    readonly factorySlots: Array<FactorySlot>;
    readonly cards: Array<Card>;
    action: Action;

    constructor(game: Game, name: string, income: int, account: int, score: int, factorySlots: Array<FactorySlot>, cards: Array<Card>) {
        this.game = game;
        this.name = name;
        this.income = income;
        this.account = account;
        this.score = score;
        this.factorySlots = factorySlots;
        this.cards = cards;
        
        this.action = ACTION_TYPE_EMPTY.create(game, this);
    }
}