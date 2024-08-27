import { FacilityModel } from "../../model/facility/Facility";
import { ItemModel } from "../../model/item/Item";

export interface OrbFullPanelModel {
    readonly specialResources: Array<ItemModel>;
    readonly resources: Array<ItemModel>;
    readonly facilities: Array<FacilityModel>;
}