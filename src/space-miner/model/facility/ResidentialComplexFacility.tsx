import { ReactNode } from "react";
import { double, int } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class ResidentialComplexFacility extends Facility {

    readonly capacity: int = 0;
    tempRecordLiveSupport: double = 0;

    constructor(capacity: int = 0, efficiency: int = 1.0) {
        super(efficiency);
        this.strength = 100;
        this.capacity = capacity;
        this.name = "residential_complex";
    }

    override get displayedName(): Text {
        return new I18nText(`facility.residential_complex.name`);
    }

    override get description(): Text {
        return new I18nText(`facility.residential_complex.description`);
    }

    override tick(game: Game): void {
        if (!this.location) return;
        const population = this.efficiency * this.capacity;
        const requiringElectricity = 1.0 * population;
        const electricity = this.location.orb.supplimentNetwork.requireElectricity(requiringElectricity, this);
        const liveSupport = 1.0 * electricity;
        this.location.orb.supplimentNetwork.supplyLiveSupport(liveSupport, this);
        this.tempRecordLiveSupport = liveSupport;
    }

    override copy(): Facility {
        return new ResidentialComplexFacility(this.capacity, this.efficiency);
    }

    override renderIcon(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="ResidentialComplexFacility FacilityCommon">
                <div className="window"></div>
                <div className="window"></div>
                <div className="window"></div>
                <div className="window"></div>
            </div>
        );
    }

    override  renderStatus(): ReactNode {
        return (
            <div className="ResidentialComplexFacility FacilityCommon">
                <div className="config">
                    <p className="config-item">当前效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">人口容量：{shortenAsHumanReadable(this.capacity)}</p>
                    <p className="config-item">提供维生：{shortenAsHumanReadable(this.tempRecordLiveSupport)}</p>
                </div>
            </div>
        );
    }
}