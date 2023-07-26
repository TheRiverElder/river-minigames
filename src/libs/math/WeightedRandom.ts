import { Pair } from "../CommonTypes";
import { sumBy } from "../lang/Collections";
import { Nullable } from "../lang/Optional";
import NativeRandom from "./NativeRandom";
import Random from "./Random";

export default class WeightedRandom<T = any> {
    protected readonly candicates: Array<Pair<T, number>>;

    constructor(candicates: Array<Pair<T, number>>) {
        this.candicates = candicates;
    }

    get total(): number {
        return sumBy(this.candicates, p => p[1]);
    }

    random(random: Random = NativeRandom.INSTANCE): T {
        if (this.candicates.length === 0) throw Error("No candicates!");
        const hit = random.next() * this.total;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return this.candicates[this.candicates.length - 1][0];
    }

    randomWithNull(total: number, random: Random = NativeRandom.INSTANCE): Nullable<T> {
        const hit = random.next() * total;
        if (hit >= this.total) return null;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return null;
    }

    randomWithDefault(total: number, defaultValue: T, random: Random = NativeRandom.INSTANCE): T {
        const hit = random.next() * total;
        if (hit >= this.total) return defaultValue;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return defaultValue;
    }
}