import { double } from "../../libs/CommonTypes";
import { constrains } from "../../libs/math/Mathmatics";
import PropertyManager, { PropertyType } from "../PropertyManager";

export function getMinimumRatio(properties: PropertyManager, requirements: Array<[PropertyType, double]>): double {
    return Math.max(0.0, Math.min(1.0, ...requirements.map(([pt, r]) => constrains(properties.get(pt) / r, 0.0, 1.0))));
}

export function comsumeByMinimumRatio(properties: PropertyManager, requirements: Array<[PropertyType, double]>): double {
    const ratio = getMinimumRatio(properties, requirements);
    requirements.forEach(([pt, r]) => properties.mutate(pt, -ratio * r));
    return ratio;
}