import I18n from "./I18n";

export const SYNBOL_TEXT = Symbol("text");

export default interface Text {
    process(i18n: I18n): string;
    [SYNBOL_TEXT]: string;
}