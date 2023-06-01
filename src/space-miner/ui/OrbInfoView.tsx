import { Component, ReactNode } from "react";
import Game from "../Game";
import Orb from "../model/Orb";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";

export interface OrbInfoViewProps extends SpaceMinerUICommonProps {
    orb: Orb;
}

export default class OrbInfoView extends Component<OrbInfoViewProps> {

    override render(): ReactNode {
        const orb = this.props.orb;
        const game = this.props.game;

        return (
            <div className="OrbInfoView">
                <div>
                    {/* <OrbView orb={orb} game={game}/> */}
                </div>
                
            </div>
        );
    }
    
}