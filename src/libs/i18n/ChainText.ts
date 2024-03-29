import { mapModel } from "../io/Displayable";
import I18n from "./I18n";
import Text, { SYNBOL_TEXT, TextModel } from "./Text";

// export type TextOrString = Text | string;

export default class ChainText implements Text<ChainTextModel> {

    [SYNBOL_TEXT]: string;
    readonly elements: ReadonlyArray<Text>;

    constructor(elements: Array<Text>) {
        this.elements = elements.slice();
        this[SYNBOL_TEXT] = "<ChainText>";
    }

    getDisplayedModel(): ChainTextModel {
        return {
            ["displayable_text"]: this[SYNBOL_TEXT],
            type: "chain",
            elements: this.elements.map(mapModel),
        };
    }

    process(i18n: I18n): string {
        return this.elements.map(element => element.process(i18n)).join("");
    }
}

export interface ChainTextModel extends TextModel {
    readonly type: "chain";
    readonly elements: ReadonlyArray<TextModel>;
};