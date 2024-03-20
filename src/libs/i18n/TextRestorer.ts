import ChainText, { ChainTextModel } from "./ChainText";
import I18n from "./I18n";
import I18nText, { I18nTextModel, restoreI18nTextArgRecrusively } from "./I18nText";
import PlainText, { PlainTextModel } from "./PlainText";
import Text, { TextModel } from "./Text";


const modelDeserializers = {
    "plain": (model: PlainTextModel) => new PlainText(model.content),
    "i18n": (model: I18nTextModel) => new I18nText(model.key, restoreI18nTextArgRecrusively(model.args, restoreText)),
    "chain": (model: ChainTextModel) => new ChainText(model.elements.map(restoreText)),
} as any;

export function restoreText(model: TextModel): Text {
    const restorer = modelDeserializers[model.type];
    if (!restorer) throw Error("Is not text: " + model);
    return restorer(model);
}

export function restoreTextAndProcess(model: TextModel, i18n: I18n): string {
    return restoreText(model).process(i18n);
}