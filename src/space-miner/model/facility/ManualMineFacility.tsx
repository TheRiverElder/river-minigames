import { ReactNode } from "react";
import { Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import Facility from "./Facility";

export default class ManualMineFacility extends Facility implements Collector {

    constructor() {
        super();
        this.name = "manual_mine";
    }

    operated: boolean = false;

    override copy(): Facility {
        return new ManualMineFacility();
    }

    override tick(game: Game): void {
        if (this.operated && this.location) {
            const resources = this.location.orb.onDrain(this, 200 / (20 * 60), this.location);
            this.location.orb.supplimentNetwork.resources.addAll(resources);
        }
    }
    
    override postTick(game: Game): void {
        this.operated = false;
    }

    override getTools(props: SpaceMinerUICommonProps): Pair<Text, Function>[] {
        return [
            ...super.getTools(props),
            [
                new I18nText(`facility.${this.name}.tool.operate`),
                () => this.operated = true,
            ],
        ];
    }

    canCollect(item: ResourceItem): boolean {
        return item.resourceType.hardness <= 10;
    }

}