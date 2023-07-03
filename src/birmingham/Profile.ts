import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";

export default interface Profile {
    cards: Array<string>;

    money: int;
    incomeLevel: int;
    incomePoints: int;
    totalGoals: int;

    ordinal: int;
    action: Nullable<{
        type: string;
        card: string;
        data: any;
    }>;
}