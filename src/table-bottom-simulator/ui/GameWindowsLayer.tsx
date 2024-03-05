import { Component, ReactNode } from "react";
import DragContainer from "../../libs/drag/DragContainer";
import TableBottomSimulatorClient from "../simulator/TableBottomSimulatorClient";
import "./GameWindowsLayer.scss";
import GameWindowView from "./GameWindowView";

export interface GameWindowsLayerProps {
    simulator: TableBottomSimulatorClient;
    dragContainer: DragContainer;
}

export default class GameWindowsLayer extends Component<GameWindowsLayerProps> {

    

    render(): ReactNode {
        return (
            <div className="GameWindowsLayer">
                {this.props.simulator.windows.values().map(window => (
                    <GameWindowView 
                        key={window.uid} 
                        window={window} 
                        dragConteiner={this.props.dragContainer} 
                    />
                ))}
            </div>
        )
    }
}