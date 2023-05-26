import { ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import { Card, CardSeries } from "../builtin/behavior/CardBehavior";
import TableBottomSimulatorClient, { GameWindow, GameWindowContent } from "../TableBottomSimulatorClient";
import BirminghamPlayer from "./BirminghamPlayer";
import BirminghamWindowContent from "./BirminghamWindowContent";

export const REGISTRY_PLAYER = new Registry<int, BirminghamPlayer>(player => player.user.uid);

// 只是注册一些主要的BehaviorType
export default function initializeBirmingham(simulator: TableBottomSimulatorClient) {
    const cardSeries = new CardSeries("birmingham", "purple");
    createAndAddCard(cardSeries, cardIdList);
    CardSeries.SERIES.add(cardSeries);

    const birminghamWindow = simulator.createWindow(new BirminghamWindowContent());
    simulator.windows.add(birminghamWindow);
}

const cardIdList = [
    "any",
    "belper",
    "brimingham",
    "brewery",
    "burton_upon_trent",
    "cannock",
    "coal_mine",
    "coalbrookdale",
    "coventry",
    "cutton_mill_manufacturer",
    "derby",
    "iron_works",
    "kidderminster",
    "leek",
    "manufacturer_cutton_mill",
    "manufacturer_cutton_mill_2",
    "nuneaton",
    "pottery",
    "redditch",
    "stafford",
    "stoke_on_trent",
    "stone",
    "tamworth",
    "uttoxeter",
    "walsall",
    "wild",
    "wolverhampton",
    "worcester",
];

function createAndAddCard(series: CardSeries, names: Array<string>) {
    for (const name of names) {
        const face = `http://localhost:8089/minigames/birmingham/images/common/cards/${name}.jpg`;
        const card = new Card(name, series, face);
        series.cards.add(card);
    }
}