import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import Miner from "../miner/Miner";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./PrimaryColonyFacility.scss";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";

export default class PrimaryColonyFacility extends Facility implements Collector {

    constructor(efficiency: double = 1.0) {
        super(efficiency);
        this.strength = 50;
        this.name = "primary_colony";
    }

    override tick(game: Game): void {
        if (!this.location || this.efficiency <= 0) return;
        
        this.location.orb.supplimentNetwork.supplyElectricity(5000 / (20 * 60) * this.efficiency, this);
        this.location.orb.supplimentNetwork.supplyLiveSupport(100 / (20 * 60) * this.efficiency, this);

        const resources = this.location.orb.onDrain(this, 200 / (20 * 60) * this.efficiency, this.location);
        this.location.orb.supplimentNetwork.resources.addAll(resources);
    }

    override copy(): Facility {
        return new PrimaryColonyFacility(this.efficiency);
    }

    override renderIcon(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="PrimaryColonyFacility FacilityCommon">
                <div className="icon">
                    <div className="dome">
                        <div className="leaf"></div>
                    </div>
                </div>
            </div>
        );
    }

    override renderStatus(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="DrillWellFacility FacilityCommon">
                <div className="config">
                    <span className="config-item">当前效率：{toPercentString(this.efficiency)}</span>
                </div>
            </div>
        );
    }

    canCollect(item: ResourceItem): boolean {
        return item.resourceType.hardness <= 10;
    }
}