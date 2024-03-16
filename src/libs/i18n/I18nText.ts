import { Productor } from "../CommonTypes";
import { Nullable } from "../lang/Optional";
import I18n from "./I18n";
import Text, { SYNBOL_TEXT, TextModel, asText } from "./Text";

export default class I18nText implements Text<I18nTextModel> {

    [SYNBOL_TEXT]: string;
    readonly key: string;
    readonly args: Nullable<any>;

    constructor(key: string, args?: any) {
        this.key = key;
        this.args = args || null;
        this[SYNBOL_TEXT] = key;
    }

    getDisplayedModel(): I18nTextModel {
        return {
            type: "i18n",
            key: this.key,
            args: Object.fromEntries(Object.entries(this.args).map(([k, v]) => [k, mapArgValue(v)])),
        };
    }

    process(i18n: I18n): string {
        return i18n.get(this.key, this.args);
    }
}

function mapArgValue(v: any): any {
    const text = asText(v);
    if (text !== null) {
        const model = text.getDisplayedModel();
        (model as any)[Symbol.keyFor(SYNBOL_TEXT)!] = text[SYNBOL_TEXT];
        return model;
    }
    return v;
}

export function restoreArgValue(v: any, restoreText: Productor<TextModel, Text>): any {
    if (!!v[Symbol.keyFor(SYNBOL_TEXT)!]) return restoreText(v);
    return v;
}

export interface I18nTextModel extends TextModel {
    readonly type: "i18n";
    readonly key: string;
    readonly args: object;
};