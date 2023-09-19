import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import DrillWellFacility from "../../model/facility/DrillWellFacility";
import FacilityConfigView, { FacilityConfigViewProps } from "./FacilityConfigView";

export interface DrillWellFacilityConfigViewState {
    efficiency: double;
}

export default class DrillWellFacilityConfigView extends FacilityConfigView<DrillWellFacility, DrillWellFacilityConfigViewState> {
    constructor(props: FacilityConfigViewProps<DrillWellFacility>) {
        super(props);
        this.state = {
            efficiency: this.facility.efficiency,
        };
    }
    
    override render(): ReactNode {
        return (
            <div className="DrillWellFacilityConfigView">
                <div className="config-item">
                    <span className="config-item-name">Efficiency</span>
                    <input 
                        type="range" min={0.0} max={1.0} step={0.05} 
                        onChange={e => this.setState({ efficiency: parseFloat(e.target.value) || this.state.efficiency })}
                    />
                </div>
            </div>
        );
    }
}