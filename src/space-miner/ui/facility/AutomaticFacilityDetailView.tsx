import { Component, ReactNode } from "react";
import { FacilityModel } from "../../model/facility/Facility";
import { FacilityDetailViewProps } from "./FacilityDetailView";
import GenericFacilityDetailView from "./GenericFacilityDetailView";

export interface AutomaticFacilityDetailViewProps extends FacilityDetailViewProps {
    facility: FacilityModel;
}

export default class AutomaticFacilityDetailView extends Component<AutomaticFacilityDetailViewProps> {
    override render(): ReactNode {
        return <GenericFacilityDetailView {...this.props}/>
    }
}