import { mapModel } from "../io/Displayable";
import I18n from "./I18n";
import Text, { SYMBOL_TEXT_PROCESS, TextModel } from "./Text";

// export type TextOrString = Text | string;

export default class ChainText implements Text<ChainTextModel> {

    readonly elements: ReadonlyArray<Text>;

    constructor(elements: Array<Text>) {
        this.elements = elements.slice();
    }

    getDisplayedModel(): ChainTextModel {
        return {
            type: "chain",
            elements: this.elements.map(mapModel),
        };
    }

    process(i18n: I18n): string {
        return this[SYMBOL_TEXT_PROCESS](i18n);
    }

    [SYMBOL_TEXT_PROCESS](i18n: I18n): string {
        return this.elements.map(element => element[SYMBOL_TEXT_PROCESS](i18n)).join("");
    }
}

export interface ChainTextModel extends TextModel {
    readonly type: "chain";
    readonly elements: ReadonlyArray<TextModel>;
};