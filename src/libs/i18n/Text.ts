import { Displayable } from "../io/Displayable";
import I18n from "./I18n";

export const SYNBOL_TEXT = Symbol("text");

export default interface Text<TModel = TextModel> extends Displayable<TModel> {
    process(i18n: I18n): string;
    [SYNBOL_TEXT]: string;
}

export function isText(obj: any): boolean {
    if (typeof obj !== 'object') return false;
    if (typeof obj[SYNBOL_TEXT] !== 'string') return false;
    return true;
}

export function asText(obj: any): Text | null {
    return isText(obj) ? obj as Text : null;
}

export interface TextModel {
    readonly type: string;
};