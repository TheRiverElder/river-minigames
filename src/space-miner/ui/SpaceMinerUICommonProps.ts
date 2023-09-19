import { Component } from "react";
import I18n from "../../libs/i18n/I18n";
import Game from "../Game";

export default interface SpaceMinerUICommonProps {
    i18n: I18n;
    game: Game;
    client: SpaceMinerClient;
    resources: Map<string, string>;
}

export interface SpaceMinerClient {
    openTab(tab: Component): void;
}