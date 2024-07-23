import I18n from "./I18n";
import Text, { SYMBOL_TEXT_PROCESS, TextModel } from "./Text";

export default class PlainText implements Text<PlainTextModel> {

    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    getDisplayedModel(): PlainTextModel {
        return {
            type: "plain",
            content: this.content,
        };
    }
    

    [SYMBOL_TEXT_PROCESS](i18n: I18n): string {
        return this.content;
    }
}

export interface PlainTextModel extends TextModel {
    readonly type: "plain";
    readonly content: string;
};