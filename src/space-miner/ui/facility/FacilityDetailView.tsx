import { Component, ReactNode } from "react";
import SpaceMinerGameClientCommonProps from "../common";
import { FacilityModel } from "../../model/facility/Facility";

export interface FacilityDetailViewProps extends SpaceMinerGameClientCommonProps {
    facility: FacilityModel;
}

export default abstract class FacilityDetailView extends Component<FacilityDetailViewProps> {
    abstract render(): ReactNode;
}