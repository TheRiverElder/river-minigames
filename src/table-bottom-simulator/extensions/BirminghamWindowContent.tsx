import { ReactNode } from "react";
import { GameWindowContent, GameWindow } from "../TableBottomSimulatorClient";

export default class BirminghamWindowContent implements GameWindowContent {

    render(window: GameWindow): ReactNode {
        return (
            <div>TEST</div>
        );
    }

}