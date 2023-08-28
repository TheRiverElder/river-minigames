import I18n from "../../libs/i18n/I18n";
import Game from "../Game";
import PixiAdapter from "./graphics/PixiAdapter";

export default interface SpaceMinerUICommonProps {
    i18n: I18n;
    game: Game;
    resources: Map<string, string>;
}