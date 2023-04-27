
export default class CardType {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export const CARD_TYPE_INDUSTRY = new CardType("产业");
export const CARD_TYPE_CITY = new CardType("城市");
export const CARD_TYPE_EMPTY = new CardType("<空>");