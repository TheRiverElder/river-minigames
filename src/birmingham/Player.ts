import { int } from "../libs/CommonTypes";
import Action from "./action/Action";
import { ACTION_TYPE_EMPTY } from "./action/ActionType";
import Card from "./Card";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import { UpdatableUnique } from "./UpdatableUnique";

export default class Player implements UpdatableUnique {
    readonly uid: int;
    readonly game: Game;
    readonly name: string;
    income: int;
    account: int;
    score: int;
    cost: int = 0; // 记录回合花的钱
    readonly factorySlots: Array<FactorySlot>;
    readonly cards: Array<Card>;
    action: Action;

    constructor(game: Game, uid: int, name: string, income: int, account: int, score: int, factorySlots: Array<FactorySlot>, cards: Array<Card>) {
        this.game = game;
        this.uid = uid;
        this.name = name;
        this.income = income;
        this.account = account;
        this.score = score;
        this.factorySlots = factorySlots;
        this.cards = cards;
        
        this.action = ACTION_TYPE_EMPTY.create(game, this);

        game.listenUpdate(this);
    }

    update(data: any): void {
        this.income = data.income;
        this.account = data.account;
        this.score = data.score;
        this.cost = data.cost;
    }
}