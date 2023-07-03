import { Nullable } from "../libs/lang/Optional";

export default interface Profile {
    cards: Array<string>;
    action: Nullable<{
        type: string;
        data: any;
    }>;
}