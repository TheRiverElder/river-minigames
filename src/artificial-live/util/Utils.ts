import { double, Productor } from "../../libs/CommonTypes";
import { constrains } from "../../libs/math/Mathmatics";
import PropertyManager, { PropertyType } from "../PropertyManager";

export function getMinimumRate(properties: PropertyManager, requirements: Array<[PropertyType, double]>): double {
    return Math.max(0.0, Math.min(1.0, ...requirements.map(([pt, r]) => constrains(properties.get(pt) / r, 0.0, 1.0))));
}


export function consumeByMinimumRate(properties: PropertyManager, requirements: Array<[PropertyType, double]>): double {
    const rate = getMinimumRate(properties, requirements);
    requirements.forEach(([pt, r]) => properties.mutate(pt, -rate * r));
    return rate;
}

export function consumerDeltaByRate(rate: double): Productor<double, double> {
    return (v: double) => -constrains(1.0 - rate, 0.0, 1.0) * v;
}