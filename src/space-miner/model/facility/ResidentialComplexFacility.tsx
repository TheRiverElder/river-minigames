import { ReactNode } from "react";
import { double, int } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class ResidentialComplexFacility extends Facility {

    readonly capacity: int = 0;
    efficiency: double = 0;
    liveSupport: double = 0;

    constructor(capacity: int = 0, efficiency: int = 0) {
        super();
        this.capacity = capacity;
        this.efficiency = efficiency;
        this.name = "residential_complex";
    }

    get displayedName(): Text {
        return new I18nText(`facility.residential_complex.name`);
    }

    get description(): Text {
        return new I18nText(`facility.residential_complex.description`);
    }

    setup(): void {
        
    }

    tick(game: Game): void {
        if (!this.location) return;
        const population = this.efficiency * this.capacity;
        const requiringElectricity = 1.0 * population;
        const electricity = this.location.orb.supplimentNetwork.requireElectricity(requiringElectricity);
        const liveSupport = 1.0 * electricity;
        this.location.orb.supplimentNetwork.liveSupport += liveSupport;
        this.liveSupport = liveSupport;
    }

    copy(): Facility {
        return new ResidentialComplexFacility(this.capacity, this.efficiency);
    }

    get configItems(): ConfigItem<any>[] {
        return [
            new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
        ];
    }

    get config(): any {
        return {
            efficiency: this.efficiency,
        };
    }

    set config(value: any) {
        this.efficiency = value.efficiency;
    }

    renderStatus(): ReactNode {
        return (
            <div className="TranditionalMineFacility">
                <div className="config">
                    <p className="config-item">当前效率：{(this.efficiency * 100).toFixed(1)}%</p>
                    <p className="config-item">容量：{shortenAsHumanReadable(this.capacity)}</p>
                    <p className="config-item">提供维生：{shortenAsHumanReadable(this.liveSupport)}</p>
                </div>
            </div>
        );
    }
}