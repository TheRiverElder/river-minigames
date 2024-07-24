import { Productor } from "../CommonTypes";
import { Nullable } from "../lang/Optional";
import I18n from "./I18n";
import Text, { SYMBOL_TEXT_PROCESS, TextModel, asText, isText } from "./Text";

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
            args: saveI18nTextArgRecrusively(this.args) ?? undefined,
        };
    }

    process(i18n: I18n): string {
        return this[SYMBOL_TEXT_PROCESS](i18n);
    }

    [SYMBOL_TEXT_PROCESS](i18n: I18n): string {
        return i18n.get(this.key, this.args);
    }
}

export function restoreI18nTextArgRecrusively(raw: I18nTextArgModel | null, restoreText: Productor<TextModel, Text>): any {
    if (raw === null || raw === undefined) return null;
    const [value, valueIsText] = raw;
    if (valueIsText === true) return restoreText(value as TextModel);
    if (typeof value === 'object') {
        if (Array.isArray(value)) return value.map(it => restoreI18nTextArgRecrusively(it as any, restoreText));
        else return Object.fromEntries(Object.entries(value as any).map(([k, v]) => [k, restoreI18nTextArgRecrusively(v as any, restoreText)]));
    }
    return value;
}

export function saveI18nTextArgRecrusively(raw: any): I18nTextArgModel | null {

    const records: Set<any> = new Set();

    function doSave(value: any): I18nTextArgModel | null {
        if (value === null) return null;
        if (typeof value === 'object') {
            if (records.has(value)) return null;
            records.add(value);
            if (isText(value)) return [(value as Text).getDisplayedModel(), true];
            if (Array.isArray(value)) return [value.map(doSave), false] as I18nTextArgModel;
            else return [Object.fromEntries(Object.entries(value).map(([k, v]) => [k, doSave(v)]))];
        }
        return [value];
    }

    return doSave(raw);
}

export interface I18nTextModel extends TextModel {
    readonly type: "i18n";
    readonly key: string;
    readonly args?: I18nTextArgModel;
};

export type DeepI18nTextArgModel = Array<I18nTextArgModel> | { [key: string]: I18nTextArgModel | null };
export type I18nTextArgModel = [string | number | boolean | null | TextModel | DeepI18nTextArgModel, boolean?];