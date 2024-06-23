import { Component, ReactNode } from "react";
import { FacilityModel } from "../../model/facility/Facility";
import { SpaceMinerGameClientCommonProps } from "../common";

export interface FacilityDetailViewProps extends SpaceMinerGameClientCommonProps {
    facility: FacilityModel;
}

export default abstract class FacilityDetailView extends Component<FacilityDetailViewProps> {
    abstract render(): ReactNode;
}