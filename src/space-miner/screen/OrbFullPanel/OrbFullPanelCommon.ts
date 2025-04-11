import { Pair, double } from "../../../libs/CommonTypes";
import { FacilityModel } from "../../model/facility/Facility";
import { ItemModel } from "../../model/item/Item";
import { OrbInfoModel } from "../../model/orb/Orb";

export const OrbFullPanelCommon = Object.freeze({
    ID: "orb_full_panel", 
    Commands: {
        
    },
});

export interface OrbFullPanelModel {
    readonly orbInfo: OrbInfoModel;
    readonly specialResources: Array<Pair<string, double>>;
    readonly resources: Array<Pair<string, double>>;
    readonly otherItems: Array<ItemModel>;
    readonly facilities: Array<FacilityModel>;
}