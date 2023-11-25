import { ReactNode } from "react";
import SpaceMinerUICommonProps from "../../../ui/SpaceMinerUICommonProps";
import Facility from "../Facility";

export default abstract class FacilityView<TFacility> {
    
    readonly facility: TFacility;

    constructor(facility: TFacility) {
        this.facility = facility;
    }

    abstract renderIcon(props: SpaceMinerUICommonProps): ReactNode;
    abstract renderConfigList(props: SpaceMinerUICommonProps): ReactNode;
    abstract renderStatus(props: SpaceMinerUICommonProps): ReactNode;
}