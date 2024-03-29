import { CSSProperties } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import ObservableRegistry from "../../../libs/management/ObservableRegistry";
import Registry from "../../../libs/management/Registry";
import BehaviorAdaptor from "../../simulator/gameobject/BehaviorAdaptor";
import BehaviorType from "../../simulator/gameobject/BehaviorType";
import Side from "../../simulator/gameobject/Side";
import BooleanConfigItem from "../../ui/config/BooleanConfigItem";
import ConfigItem from "../../ui/config/ConfigItem";
import SelectConfigItem from "../../ui/config/SelectConfigItem";
import Vector2 from "../../../libs/math/Vector2";

export default class CardBehavior extends BehaviorAdaptor {
    static readonly TYPE = new BehaviorType("card", Side.BOTH, (...args) => new CardBehavior(...args));

    flipped: boolean = false;
    series: Nullable<CardSeries> = null;
    card: Nullable<Card> = null;

    override onInitialize(): void {
        this.refreshHost();
    }

    refreshHost() {
        // console.log(this)
        if (this.card) {
            this.host.background = !this.flipped ? this.card.face : this.card.series.back;
            this.host.onUiUpdateListeners.emit();
        }
    }

    override handleRenderCssProperties(properties: CSSProperties): void {
        if (this.card) {
            Object.assign(properties, {
                backgroundColor: `purple`,
                backgroundImage: `url("${this.flipped ? this.card.back : this.card.face}")`,
                backgroundPosition: `center`,
                backgroundSize: `100% 100%`,
                backgroundRepeat: `no-repeat`,
            });
            
            const cardSize = this.card.size;
            if (cardSize) {
                Object.assign(properties, cardSize.toSizeCss());
            }
        }
    }

    override save() {
        return {
            ...super.save(),
            flipped: this.flipped,
            series: this.series?.name || null,
            card: this.card?.name || null,
        };
    }

    override restore(data: any): void {
        super.restore(data);
        this.flipped = !!data.flipped;
        this.series = CardSeries.SERIES.get(data.series).orNull();
        this.card = this.series?.cards.get(data.card).orNull() || null;
        this.refreshHost();
    }

    override get configItems(): ConfigItem<any>[] {
        return [
            new BooleanConfigItem("flipped", {
                get: () => this.flipped,
                set: this.createSetterAndSendUpdater(v => this.flipped = v),
            }),
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
                set: this.createSetterAndSendUpdater(v => this.card = v),
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
    static readonly SERIES = new ObservableRegistry<string, CardSeries>(series => series.name);

    readonly cards = new Registry<string, Card>(card => card.name);

    constructor(
        public readonly name: string, 
        public readonly back: string = "",
        public readonly size: Nullable<Vector2> = null,
    ) { }
}

export class Card {

    constructor(
        public readonly name: string,
        public readonly series: CardSeries,
        public readonly face: string,
        public readonly cardBack: string = "",
        public readonly cardSize: Nullable<Vector2> = null,
    ) { }

    get back(): string {
        return this.cardBack || this.series.back;
    }

    get size(): Nullable<Vector2> {
        return this.cardSize ?? this.series.size;
    }
}