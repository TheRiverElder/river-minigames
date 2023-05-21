import { Component, ReactNode } from "react";
import Orb from "../model/Orb";
import OrbView from "./OrbView";

export interface OrbInfoViewProps {
    orb: Orb;
}

export default class OrbInfoView extends Component<OrbInfoViewProps> {

    override render(): ReactNode {
        const orb = this.props.orb;

        return (
            <div className="OrbInfoView">
                <div>
                    <OrbView orb={orb}/>
                </div>
                
            </div>
        );
    }
    
}