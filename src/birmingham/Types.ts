import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";

export type Location = [string, int];

export function locationEquals(l1: Location, l2?: Nullable<Location>): boolean {
    return l1 === l2 || (!!l2 && l1[0] === l2[0] && l1[1] === l2[1]);
}