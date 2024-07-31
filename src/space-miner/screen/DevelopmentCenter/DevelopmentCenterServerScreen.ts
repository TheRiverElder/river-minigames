import { int } from "../../../libs/CommonTypes";
import { mapModel } from "../../../libs/io/Displayable";
import Technology from "../../model/technology/Technology";
import GenericServerScreen, { createGenericServerScreenType } from "../../worker/screen/GenericServerScreen";
import { DevelopmentCenterCommon, DevelopmentCenterModel } from "./DevelopmentCenterCommon";

export default class DevelopmentCenterServerScreen extends GenericServerScreen<DevelopmentCenterServerScreen> {

    public static readonly TYPE = createGenericServerScreenType(DevelopmentCenterCommon.ID, DevelopmentCenterServerScreen);

    override collectClientUiData(): DevelopmentCenterModel {
        const game = this.game;
        const profile = game.profile;

        return {
            techPoints: profile.techPoints,
            technologies: game.technologies.values().map(tech => ({
                ...tech.getDisplayedModel(),
                unlocked: profile.unlockedTechnologies.has(tech),
                canUnlock: true,
            })),
        };
    }

    override receive(command: string, data?: any): any {
        switch (command) {
            case DevelopmentCenterCommon.Commands.UNLOCK: {
                this.unlock(...(data as [string, int]));
                this.updateClientUiData();
            } break;
            default: return super.receive(command, data);
        }
    }

    unlock(name: string, level: int) {
        const game = this.game;
        const profile = game.profile;

        const technology = game.technologies.getOrThrow(Technology.getRegistryName(name, level));
        profile.unlockedTechnologies.add(technology);
    }
}