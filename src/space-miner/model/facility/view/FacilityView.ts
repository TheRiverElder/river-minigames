import { ReactNode } from "react";
import SpaceMinerGameClientCommonProps from "../../../ui/common";
import Facility from "../Facility";

export default abstract class FacilityView<TFacility> {
    
    readonly facility: TFacility;

    constructor(facility: TFacility) {
        this.facility = facility;
    }

    abstract renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode;
    abstract renderConfigList(props: SpaceMinerGameClientCommonProps): ReactNode;
    abstract renderStatus(props: SpaceMinerGameClientCommonProps): ReactNode;
}