import { TechnologyModel } from "../../model/technology/Technology";

export const DevelopmentCenterCommon = {
    ID: "development_center", 
    Commands: {
        UNLOCK: "unlock",
    },
};

export type DevelopmentCenterModel = {
    readonly technologies: Array<TechnologyByProfileModel>;
};

export type TechnologyByProfileModel = TechnologyModel & {
    readonly unlocked: boolean;
    readonly canUnlock: boolean;
};