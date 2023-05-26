import { Nullable } from "../../../libs/lang/Optional";
import Registry from "../../../libs/management/Registry";
import BehaviorAdaptor from "../../gameobject/BehaviorAdaptor";
import BehaviorType from "../../gameobject/BehaviorType";
import Side from "../../gameobject/Side";
import ConfigItem from "../../ui/config/ConfigItem";
import SelectConfigItem from "../../ui/config/SelectConfigItem";

export default class CardBehavior extends BehaviorAdaptor {
    static readonly TYPE = new BehaviorType("card", Side.BOTH, (...args) => new CardBehavior(...args));

    series: Nullable<CardSeries> = null;
    card: Nullable<Card> = null;

    override onInitialize(): void {
        this.refreshhost();
    }

    refreshhost() {
        if (this.card) {
            this.host.background = this.card.face;
            this.host.onUiUpdateListeners.emit();
        }
    }

    override save() {
        return {
            ...super.save(),
            series: this.series?.name || null,
            card: this.card?.name || null,
        };
    }

    override restore(data: any): void {
        super.restore(data);    
        this.series = CardSeries.SERIES.get(data.series).orNull();
        this.card = this.series?.cards.get(data.card).orNull() || null;
        this.refreshhost();
    }
    
    override get configItems(): ConfigItem<any>[] {
        return [
            new SelectConfigItem<Nullable<CardSeries>>("series", {
                get: () => this.series,
                set: this.createSetterAndSendUpdater(v => this.series = v),
            }, {
                getOptions: () => CardSeries.SERIES.values(),
                getValue: o => o?.name || "",
                getOption: o => CardSeries.SERIES.get(o).orNull(),
                getName: o => o?.name || "",
            }),
            new SelectConfigItem<Nullable<Card>>("card", {
                get: () => this.card,
                set: (value) => {
                    this.card = value;
                    this.sendUpdate();
                },
            }, {
                getOptions: () => this.series?.cards.values() || [],
                getValue: o => o?.name || "",
                getOption: o => this.series?.cards.get(o).orNull() || null,
                getName: o => o?.name || "",
            }),
        ];
    }
}

export class CardSeries {
    static readonly SERIES = new Registry<string, CardSeries>(series => series.name);

    readonly name: string;
    readonly back: string;

    readonly cards = new Registry<string, Card>(card => card.name);

    constructor(name: string, back: string) {
        this.name = name;
        this.back = back;
    }
}

export class Card {
    readonly name: string;
    readonly series: CardSeries;
    readonly face: string;

    constructor(name: string, series: CardSeries, face: string) {
        this.name = name;
        this.series = series;
        this.face = face;
    }
}