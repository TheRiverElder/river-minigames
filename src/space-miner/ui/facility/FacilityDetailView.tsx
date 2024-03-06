import { Component, ReactNode } from "react";
import SpaceMinerGameClientCommonProps from "../common";
import Facility from "../../model/facility/Facility";

export interface FacilityDetailViewProps extends SpaceMinerGameClientCommonProps {
    facility: Facility;
}

export default abstract class FacilityDetailView extends Component<FacilityDetailViewProps> {
    abstract render(): ReactNode;
}