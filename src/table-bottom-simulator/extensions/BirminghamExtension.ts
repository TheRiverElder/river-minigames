import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Registry from "../../libs/management/Registry";
import { Card, CardSeries } from "../builtin/behavior/CardBehavior";
import { Extension } from "../Extension";
import TableBottomSimulatorClient, {  } from "../TableBottomSimulatorClient";
import Action from "./action/Action";
import BirminghamBaseBehavior from "./behaviors/BirminghamBaseBehavior";
import BirminghamPlayer from "./BirminghamPlayer";
import BirminghamWindowContent from "./BirminghamWindowContent";
import BirminghamInstructionChannel from "./channels/BirminghamInstructionChannel";

export default class BirminghamExtension implements Extension {

    readonly players = new Registry<int, BirminghamPlayer>(player => player.user.uid);
    readonly objects = new Registry<int, BirminghamBaseBehavior>(behavior => behavior.host.uid);

    get name(): string {
        return "birmingham";
    }
    
    simulator!: TableBottomSimulatorClient;
    channel!: BirminghamInstructionChannel;
    action: Nullable<Action> = null;

    // 只是注册一些主要的BehaviorType
    setup(simulator: TableBottomSimulatorClient): void {
        this.simulator = simulator;

        const cardSeries = new CardSeries("birmingham", `http://localhost:8089/minigames/birmingham/image/common/card_back.jpg`);
        createAndAddCard(cardSeries, cardIdList);
        CardSeries.SERIES.add(cardSeries);
    
        const birminghamWindow = simulator.createWindow(BirminghamWindowContent as any);
        simulator.windows.add(birminghamWindow);

        this.channel = new BirminghamInstructionChannel("birmingham_instruction", simulator, this);
        simulator.channels.add(this.channel);
    }

    dispose(simulator: TableBottomSimulatorClient): void {
        
    }

    buildCache() {
        for (const gameObject of this.simulator.gameObjects.values()) {
            // TODO
        }
    }
    
}


const cardIdList = [
    "any",
    "belper",
    "birmingham",
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
        const face = `http://localhost:8089/minigames/birmingham/image/common/cards/${name}.jpg`;
        const card = new Card(name, series, face);
        series.cards.add(card);
    }
}