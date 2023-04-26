import { int } from "../libs/CommonTypes";
import Card from "./Card";
import FactorySlot from "./FactorySLot";

export default class Player {
    readonly name: string;
    income: int;
    account: int;
    score: int;
    readonly factorySlots: Array<FactorySlot>;
    readonly cards: Array<Card>;

    constructor(name: string, income: int, account: int, score: int, factorySlots: Array<FactorySlot>, cards: Array<Card>) {
        this.name = name;
        this.income = income;
        this.account = account;
        this.score = score;
        this.factorySlots = factorySlots;
        this.cards = cards;
    }
}