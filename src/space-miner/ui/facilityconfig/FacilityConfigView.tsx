import { Component, PropsWithChildren, ReactNode } from "react";
import Facility from "../../model/facility/Facility";

export interface FacilityConfigViewProps<T extends Facility> extends PropsWithChildren {
    readonly facility: T;
} 

export default class FacilityConfigView<T extends Facility, TState = any> extends Component<FacilityConfigViewProps<T>, TState> {
    
    readonly facility: T;

    constructor(props: FacilityConfigViewProps<T>) {
        super(props);
        this.facility = props.facility;
    }
}