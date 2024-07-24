import { Displayable } from "../io/Displayable";
import I18n from "./I18n";

export const SYMBOL_TEXT_PROCESS = Symbol("text_process");

export default interface Text<TModel = TextModel> extends Displayable<TModel> {
    [SYMBOL_TEXT_PROCESS](i18n: I18n): string;
    process(i18n: I18n): string;
}

export function isText(obj: any): boolean {
    if (typeof obj !== 'object') return false;
    if (typeof obj[SYMBOL_TEXT_PROCESS] !== 'function') return false;
    return true;
}

export function asText(obj: any): Text | null {
    return isText(obj) ? obj as Text : null;
}

export interface TextModel {
    readonly type: string;
};