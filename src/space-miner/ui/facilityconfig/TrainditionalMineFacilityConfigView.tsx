import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import TranditionalMineFacility from "../../model/facility/TranditionalMineFacility";
import FacilityConfigView, { FacilityConfigViewProps } from "./FacilityConfigView";

export interface TrainditionalMineFacilityConfigViewState {
    efficiency: double;
}

export default class TrainditionalMineFacilityConfigView extends FacilityConfigView<TranditionalMineFacility, TrainditionalMineFacilityConfigViewState> {

    constructor(props: FacilityConfigViewProps<TranditionalMineFacility>) {
        super(props);
        this.state = {
            efficiency: this.facility.efficiency,
        };
    }
    
    override render(): ReactNode {
        return (
            <div className="TrainditionalMineFacilityConfigView">
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