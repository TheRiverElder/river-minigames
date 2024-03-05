import I18n from "./I18n";
import Text, { SYNBOL_TEXT } from "./Text";

// export type TextOrString = Text | string;

export default class ChainText implements Text {

    [SYNBOL_TEXT]: string;
    readonly elements: ReadonlyArray<Text>;

    constructor(elements: Array<Text>) {
        this.elements = elements.slice();
        this[SYNBOL_TEXT] = "<ChainText>";
    }

    process(i18n: I18n): string {
        return this.elements.map(element => element.process(i18n)).join("");
    }
}