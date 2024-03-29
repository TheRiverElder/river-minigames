import { Card, CardSeries } from "../behavior/CardBehavior";
import Channel from "../../simulator/Channel";
import TableBottomSimulatorClient from "../../simulator/TableBottomSimulatorClient";
import { Nullable } from "../../../libs/lang/Optional";
import Vector2 from "../../../libs/math/Vector2";

export default class CardChannel extends Channel {

    static readonly UPDATE_SERIESES = "update_serieses";
    static readonly ADD_CARDS = "add_cards";

    constructor(simulator: TableBottomSimulatorClient) {
        super("card", simulator);
    }

    override receive(data: any): void {
        const action: string = data.action;
        const commandData = data.data;

        switch (action) {
            case CardChannel.UPDATE_SERIESES: {
                const dataArray = commandData as Array<CardSeriesData>;

                dataArray.forEach(d => {
                    const series = CardSeries.SERIES.get(d.name).orElseGet(() => {
                        const s = new CardSeries(d.name, d.back, d.size);
                        CardSeries.SERIES.add(s);
                        return s;
                    });

                    d.cards.forEach(it => this.updateCard(series, it));
                });
            } break;
            case CardChannel.ADD_CARDS: {
                const dataArray = commandData as Array<CardData>;

                dataArray.forEach(d => {
                    const series = CardSeries.SERIES.getOrThrow(d.seriesName);
                    this.updateCard(series, d);
                });
            } break;
            default: throw new Error(`Unknown action: ${action}`);
        }
    }

    sendRequestAllCardSeries() {
        this.send({
            action: "request_all",
            data: null,
        });
    }

    private updateCard(series: CardSeries, cardData: CardData) {
        series.cards.get(cardData.name).ifEmpty(() => {
            const c = new Card(cardData.name, series, cardData.face, cardData.cardBack);
            series.cards.add(c);
        });
    }

}

export interface CardSeriesData {
    readonly name: string;
    readonly back: string;
    readonly size: Nullable<Vector2>;
    readonly cards: Array<CardData>;
}

export interface CardData {
    readonly name: string;
    readonly seriesName: string;
    readonly face: string;
    readonly cardBack: string;
    readonly cardSize: Nullable<Vector2>;
}