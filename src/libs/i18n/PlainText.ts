import I18n from "./I18n";
import Text, { SYNBOL_TEXT, TextModel } from "./Text";

export default class PlainText implements Text<PlainTextModel> {

    [SYNBOL_TEXT]: string;
    readonly content: string;

    constructor(content: string) {
        this.content = content;
        this[SYNBOL_TEXT] = content;
    }

    getDisplayedModel(): PlainTextModel {
        return {
            ["displayable_text"]: this[SYNBOL_TEXT],
            type: "plain",
            content: this.content,
        };
    }
    

    process(i18n: I18n): string {
        return this.content;
    }
}

export interface PlainTextModel extends TextModel {
    readonly type: "plain";
    readonly content: string;
};