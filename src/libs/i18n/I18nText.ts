import { Productor } from "../CommonTypes";
import { Nullable } from "../lang/Optional";
import I18n from "./I18n";
import Text, { SYMBOL_TEXT_PROCESS, TextModel, asText } from "./Text";

export default class I18nText implements Text<I18nTextModel> {

    readonly key: string;
    readonly args: Nullable<any>;

    constructor(key: string, args?: any) {
        this.key = key;
        this.args = args || null;
    }

    getDisplayedModel(): I18nTextModel {
        return {
            type: "i18n",
            key: this.key,
            args: saveI18nTextArgRecrusively(this.args),
        };
    }

    [SYMBOL_TEXT_PROCESS](i18n: I18n): string {
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

    const records: Set<any> = new Set();

    function doSave(value: any): I18nTextArgModel | null {
        if (raw === null) return null;
        if (Array.isArray(raw)) return [raw.map(doSave), false];
        if (records.has(value)) return null;


    }
    if (typeof raw === 'object') {
        if (raw[SYMBOL_TEXT_PROCESS]) return (raw as Text).getDisplayedModel();
        return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, saveI18nTextArgRecrusively(v)]));
    }
    return raw;
}

export interface I18nTextModel extends TextModel {
    readonly type: "i18n";
    readonly key: string;
    readonly args?: DeepI18nTextArgModel;
};

export type DeepI18nTextArgModel = Array<I18nTextArgModel> | { [key: string]: I18nTextArgModel };
export type I18nTextArgModel = [string | number | boolean | null | DeepI18nTextArgModel, boolean];