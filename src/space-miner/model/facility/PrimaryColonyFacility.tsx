import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import { toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./PrimaryColonyFacility.scss";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import { CreativeType } from "../io/CreativeType";

export default class PrimaryColonyFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType<Facility>("primary_colony", (game, data) => new PrimaryColonyFacility(game));

    override tick(game: Game): void {
        if (!this.location || this.efficiency <= 0) return;
        
        this.location.orb.supplimentNetwork.supplyElectricity(5000 / (20 * 60) * this.efficiency, this);
        this.location.orb.supplimentNetwork.supplyLiveSupport(100 / (20 * 60) * this.efficiency, this);

        const resources = this.location.orb.onDrain(this, 200 / (20 * 60) * this.efficiency, this.location);
        this.location.orb.supplimentNetwork.resources.addAll(resources);
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