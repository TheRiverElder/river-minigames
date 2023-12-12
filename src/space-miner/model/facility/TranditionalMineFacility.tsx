import { ReactNode } from "react";
import { double, int } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import ResourceItem from "../item/ResourceItem";
import { Tags } from "../item/Tags";
import Collector from "../misc/Collector";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./TranditionalMineFacility.scss";

export default class TranditionalMineFacility extends Facility {

    readonly collector = new HumanCollector(this);

    readonly capacity: int = 0;
    accactableTags: Array<string> = [Tags.SOLID];

    constructor(capacity: int = 0, accactableTags: Array<string> = [Tags.SOLID], efficiency: int = 1.0) {
        super(efficiency);
        this.strength = 200;
        this.capacity = capacity;
        this.accactableTags = accactableTags;
        this.name = "tranditional_mine";
    }

    override get displayedName(): Text {
        return new I18nText(`facility.tranditional_mine.name`);
    }

    override get description(): Text {
        return new I18nText(`facility.tranditional_mine.description`);
    }

    override tick(game: Game): void {
        if (!this.location) return;

        // 员工维生
        const liveSupport = this.location.orb.supplimentNetwork.requireLiveSupport(this.capacity * this.efficiency, this);
        // 工业用电，只有获得维生的员工（即实际工作的员工）需要用到工业用电
        const industryElectricityFactor = 1;
        const electricity = this.location.orb.supplimentNetwork.requireElectricity(liveSupport * industryElectricityFactor, this);
        this.work(electricity / (this.capacity * industryElectricityFactor));
    }

    work(strength: double) {
        if (!this.location) return;
        const result = this.location.orb.onDrain(this.collector, 1.5 * strength * this.capacity, this.location);
        this.location.orb.supplimentNetwork.resources.addAll(result);
    }

    override copy(): Facility {
        return new TranditionalMineFacility(this.capacity, this.accactableTags, this.efficiency);
    }

    override renderIcon(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="TranditionalMineFacility FacilityCommon">
                <div className="hammers">
                    <div className="hammer"></div>
                    <div className="hammer"></div>
                    <div className="hammer"></div>
                </div>
                <div className="platform"></div>
            </div>
        );
    }

    override renderStatus(): ReactNode {
        return (
            <div className="TranditionalMineFacility FacilityCommon">
                <div className="config">
                    <p className="config-item">当前效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">员工容量：{shortenAsHumanReadable(this.capacity)}</p>
                </div>
            </div>
        );
    }
}

export class HumanCollector implements Collector {

    readonly facility: TranditionalMineFacility;

    constructor(facility: TranditionalMineFacility) {
        this.facility = facility;
    }

    canCollect(item: ResourceItem): boolean {
        if (item.resourceType.temperature > 80) return false;
        if (!this.facility.accactableTags.some(it => item.resourceType.tags.has(it))) return false;
        else return true;
    }
}