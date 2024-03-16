import ChainText, { ChainTextModel } from "./ChainText";
import I18nText, { I18nTextModel, restoreArgValue } from "./I18nText";
import PlainText, { PlainTextModel } from "./PlainText";
import Text, { TextModel } from "./Text";


const modelDeserializers = {
    "plain": (model: PlainTextModel) => new PlainText(model.content),
    "i18n": (model: I18nTextModel) => new I18nText(model.key, Object.fromEntries(Object.entries(model.args).map(([k, v]) => [k, restoreArgValue(v, restoreText)]))),
    "chain": (model: ChainTextModel) => new ChainText(model.elements.map(restoreText)),
} as any;

export function restoreText(model: TextModel): Text {
    const restorer = modelDeserializers[model.type];
    if (!restorer) throw Error("Is not text: " + model);
    return restorer(model);
}