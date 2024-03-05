import I18n from "./I18n";
import Text, { SYNBOL_TEXT } from "./Text";

export default class PlainText implements Text {

    [SYNBOL_TEXT]: string;
    readonly content: string;

    constructor(content: string) {
        this.content = content;
        this[SYNBOL_TEXT] = content;
    }
    

    process(i18n: I18n): string {
        return this.content;
    }
}