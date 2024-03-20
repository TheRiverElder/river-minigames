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
            ["displayable_text"]: this[SYNBOL_TEXT],
            type: "i18n",
            key: this.key,
            args: saveI18nTextArgRecrusively(this.args),
        };
    }

    process(i18n: I18n): string {
        return i18n.get(this.key, this.args);
    }
}

export function restoreI18nTextArgRecrusively(raw: any, restoreText: Productor<TextModel, Text>): any {
    if (raw === null) return null;
    if (Array.isArray(raw)) return raw.map(it => restoreI18nTextArgRecrusively(it, restoreText));
    if (typeof raw === 'object') {
        if (!!raw["displayable_text"]) return restoreText(raw);
        return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, restoreI18nTextArgRecrusively(v, restoreText)]));
    }
    return raw;
}

export function saveI18nTextArgRecrusively(raw: any): any {
    if (raw === null) return null;
    if (Array.isArray(raw)) return raw.map(it => saveI18nTextArgRecrusively(it));
    if (typeof raw === 'object') {
        if (raw[SYNBOL_TEXT]) return (raw as Text).getDisplayedModel();
        return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, saveI18nTextArgRecrusively(v)]));
    }
    return raw;
}

export interface I18nTextModel extends TextModel {
    readonly type: "i18n";
    readonly key: string;
    readonly args?: object;
};