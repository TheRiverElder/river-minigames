import { double } from "../../../libs/CommonTypes";
import { TechnologyModel } from "../../model/technology/Technology";

export const DevelopmentCenterCommon = {
    ID: "development_center", 
    Commands: {
        UNLOCK: "unlock",
    },
};

export type DevelopmentCenterModel = {
    readonly techPoints: double;
    readonly technologies: Array<TechnologyByProfileModel>;
};

export type TechnologyByProfileModel = TechnologyModel & {
    readonly unlocked: boolean;
    readonly canUnlock: boolean;
};